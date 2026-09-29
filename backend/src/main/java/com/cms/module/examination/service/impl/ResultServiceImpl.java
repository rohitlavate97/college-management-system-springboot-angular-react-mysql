package com.cms.module.examination.service.impl;

import com.cms.module.examination.dto.ResultEntryRequest;
import com.cms.module.examination.dto.ResultResponse;
import com.cms.module.examination.dto.StudentReportCardResponse;
import com.cms.module.examination.entity.ExamSubject;
import com.cms.module.examination.entity.Examination;
import com.cms.module.examination.entity.Grade;
import com.cms.module.examination.entity.Result;
import com.cms.module.examination.enums.ResultStatus;
import com.cms.module.examination.mapper.ResultMapper;
import com.cms.module.examination.repository.ExamSubjectRepository;
import com.cms.module.examination.repository.ExaminationRepository;
import com.cms.module.examination.repository.GradeRepository;
import com.cms.module.examination.repository.ResultRepository;
import com.cms.module.examination.service.ResultService;
import com.cms.module.student.entity.Student;
import com.cms.module.student.repository.StudentRepository;
import com.cms.module.user.entity.User;
import com.cms.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService {

    private final ResultRepository resultRepository;
    private final ExamSubjectRepository examSubjectRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final GradeRepository gradeRepository;
    private final ResultMapper resultMapper;
    private final ExaminationRepository examinationRepository;

    @Override
    @Transactional
    public List<ResultResponse> enterMarks(ResultEntryRequest request, String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        ExamSubject examSubject = examSubjectRepository.findById(request.getExamSubjectId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ExamSubject not found"));

        List<Grade> grades = gradeRepository.findAllByOrderByMinMarksDesc();
        List<Result> updatedResults = new ArrayList<>();

        for (ResultEntryRequest.StudentMark sm : request.getMarks()) {
            Student student = studentRepository.findById(sm.getStudentId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found ID: " + sm.getStudentId()));

            Result result = resultRepository.findByStudentIdAndExamSubjectId(student.getId(), examSubject.getId())
                    .orElse(new Result());

            if (result.getId() == null) {
                result.setStudent(student);
                result.setExamSubject(examSubject);
            }

            result.setMarksObtained(sm.getMarksObtained());
            result.setRemarks(sm.getRemarks());
            result.setEnteredBy(user);

            if (sm.getMarksObtained() != null) {
                Grade grade = determineGrade(sm.getMarksObtained(), grades);
                result.setGrade(grade);
                
                if (sm.getMarksObtained().compareTo(examSubject.getPassingMarks()) >= 0) {
                    result.setStatus(ResultStatus.PASSED);
                } else {
                    result.setStatus(ResultStatus.FAILED);
                }
            } else {
                result.setStatus(ResultStatus.ABSENT);
            }
            updatedResults.add(resultRepository.save(result));
        }

        return updatedResults.stream().map(resultMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<ResultResponse> getResultsForExamSubject(Long examSubjectId) {
        return resultRepository.findByExamSubjectId(examSubjectId).stream()
                .map(resultMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void publishResults(Long examinationId) {
        List<ExamSubject> examSubjects = examSubjectRepository.findByExaminationId(examinationId);
        LocalDateTime now = LocalDateTime.now();
        
        for (ExamSubject es : examSubjects) {
            List<Result> results = resultRepository.findByExamSubjectId(es.getId());
            for (Result r : results) {
                r.setPublished(true);
                r.setPublishedAt(now);
                resultRepository.save(r);
            }
        }
    }

    @Override
    public StudentReportCardResponse getStudentReportCard(Long studentId, Long examinationId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        Examination examination = examinationRepository.findById(examinationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Examination not found"));

        List<Result> results = resultRepository.findByStudentIdAndExamSubjectExaminationId(studentId, examinationId);
        
        return buildReportCard(student, examination, results);
    }

    @Override
    public List<StudentReportCardResponse> getStudentAllReportCards(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        
        List<Result> allResults = resultRepository.findByStudentId(studentId);
        
        return allResults.stream()
                .collect(Collectors.groupingBy(r -> r.getExamSubject().getExamination()))
                .entrySet().stream()
                .map(e -> buildReportCard(student, e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }

    private StudentReportCardResponse buildReportCard(Student student, Examination examination, List<Result> results) {
        StudentReportCardResponse response = new StudentReportCardResponse();
        response.setStudentId(student.getId());
        response.setStudentName(student.getUser().getFirstName() + " " + student.getUser().getLastName());
        response.setRollNumber(student.getRollNumber());
        response.setExaminationId(examination.getId());
        response.setExaminationName(examination.getName());
        response.setAcademicYear(examination.getAcademicYear());
        response.setSemester(examination.getSemester());

        List<ResultResponse> resultDtos = results.stream().map(resultMapper::toResponse).collect(Collectors.toList());
        response.setResults(resultDtos);

        BigDecimal totalObtained = BigDecimal.ZERO;
        BigDecimal totalMax = BigDecimal.ZERO;
        BigDecimal totalGradePoints = BigDecimal.ZERO;
        int subjectsCount = 0;

        for (Result r : results) {
            if (r.getMarksObtained() != null) {
                totalObtained = totalObtained.add(r.getMarksObtained());
                totalMax = totalMax.add(r.getExamSubject().getMaxMarks());
                if (r.getGrade() != null) {
                    totalGradePoints = totalGradePoints.add(r.getGrade().getGradePoint());
                }
                subjectsCount++;
            }
        }

        response.setObtainedMarks(totalObtained);
        response.setTotalMarks(totalMax);
        if (subjectsCount > 0) {
            response.setGpa(totalGradePoints.divide(BigDecimal.valueOf(subjectsCount), 2, RoundingMode.HALF_UP));
        }

        return response;
    }

    private Grade determineGrade(BigDecimal marks, List<Grade> grades) {
        for (Grade g : grades) {
            if (marks.compareTo(g.getMinMarks()) >= 0 && marks.compareTo(g.getMaxMarks()) <= 0) {
                return g;
            }
        }
        return null;
    }
}
