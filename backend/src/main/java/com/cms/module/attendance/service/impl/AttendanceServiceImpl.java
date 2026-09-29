package com.cms.module.attendance.service.impl;

import com.cms.exception.ResourceNotFoundException;
import com.cms.module.attendance.dto.AttendanceResponse;
import com.cms.module.attendance.dto.AttendanceStatsResponse;
import com.cms.module.attendance.dto.BatchAttendanceRequest;
import com.cms.module.attendance.entity.Attendance;
import com.cms.module.attendance.mapper.AttendanceMapper;
import com.cms.module.attendance.repository.AttendanceRepository;
import com.cms.module.attendance.service.AttendanceService;
import com.cms.module.professor.entity.Professor;
import com.cms.module.professor.repository.ProfessorRepository;
import com.cms.module.student.entity.Student;
import com.cms.module.student.repository.StudentRepository;
import com.cms.module.subject.entity.Subject;
import com.cms.module.subject.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final ProfessorRepository professorRepository;
    private final AttendanceMapper attendanceMapper;

    @Override
    @Transactional
    public List<AttendanceResponse> markBatchAttendance(BatchAttendanceRequest request) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));

        Professor professor = professorRepository.findById(request.getProfessorId())
                .orElseThrow(() -> new ResourceNotFoundException("Professor not found with id: " + request.getProfessorId()));

        List<Attendance> attendancesToSave = new ArrayList<>();

        request.getRecords().forEach(record -> {
            Student student = studentRepository.findById(record.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + record.getStudentId()));

            Attendance attendance = attendanceRepository
                    .findByStudentIdAndSubjectIdAndAttendanceDate(student.getId(), subject.getId(), request.getAttendanceDate())
                    .orElseGet(() -> Attendance.builder()
                            .student(student)
                            .subject(subject)
                            .professor(professor)
                            .attendanceDate(request.getAttendanceDate())
                            .build());

            attendance.setStatus(record.getStatus());
            attendance.setRemarks(record.getRemarks());
            attendance.setProfessor(professor); // Update professor if changed

            attendancesToSave.add(attendance);
        });

        List<Attendance> savedAttendances = attendanceRepository.saveAll(attendancesToSave);
        return savedAttendances.stream()
                .map(attendanceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AttendanceResponse> getStudentAttendance(Long studentId, Pageable pageable) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }
        return attendanceRepository.findByStudentId(studentId, pageable)
                .map(attendanceMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getSubjectAttendance(Long subjectId, LocalDate date) {
        if (!subjectRepository.existsById(subjectId)) {
            throw new ResourceNotFoundException("Subject not found with id: " + subjectId);
        }
        return attendanceRepository.findByAttendanceDateAndSubjectId(date, subjectId)
                .stream()
                .map(attendanceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceStatsResponse getStudentSubjectStats(Long studentId, Long subjectId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + subjectId));

        long totalClasses = attendanceRepository.countTotalClassesByStudentAndSubject(studentId, subjectId);
        long attendedClasses = attendanceRepository.countAttendedClassesByStudentAndSubject(studentId, subjectId);
        double percentage = totalClasses == 0 ? 0.0 : (double) attendedClasses / totalClasses * 100;

        return AttendanceStatsResponse.builder()
                .studentId(student.getId())
                .studentName(student.getUser().getFirstName() + " " + student.getUser().getLastName())
                .subjectId(subject.getId())
                .subjectName(subject.getName())
                .totalClasses(totalClasses)
                .attendedClasses(attendedClasses)
                .attendancePercentage(percentage)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceStatsResponse getOverallStudentStats(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        long totalClasses = attendanceRepository.countTotalClassesByStudent(studentId);
        long attendedClasses = attendanceRepository.countAttendedClassesByStudent(studentId);
        double percentage = totalClasses == 0 ? 0.0 : (double) attendedClasses / totalClasses * 100;

        return AttendanceStatsResponse.builder()
                .studentId(student.getId())
                .studentName(student.getUser().getFirstName() + " " + student.getUser().getLastName())
                .subjectId(null)
                .subjectName("ALL")
                .totalClasses(totalClasses)
                .attendedClasses(attendedClasses)
                .attendancePercentage(percentage)
                .build();
    }
}
