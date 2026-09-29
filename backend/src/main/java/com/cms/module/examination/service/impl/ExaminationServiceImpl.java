package com.cms.module.examination.service.impl;

import com.cms.module.examination.dto.ExamSubjectRequest;
import com.cms.module.examination.dto.ExamSubjectResponse;
import com.cms.module.examination.dto.ExaminationRequest;
import com.cms.module.examination.dto.ExaminationResponse;
import com.cms.module.examination.entity.ExamSubject;
import com.cms.module.examination.entity.Examination;
import com.cms.module.examination.enums.ExaminationStatus;
import com.cms.module.examination.mapper.ExamSubjectMapper;
import com.cms.module.examination.mapper.ExaminationMapper;
import com.cms.module.examination.repository.ExamSubjectRepository;
import com.cms.module.examination.repository.ExaminationRepository;
import com.cms.module.examination.service.ExaminationService;
import com.cms.module.subject.entity.Subject;
import com.cms.module.subject.repository.SubjectRepository;
import com.cms.module.user.entity.User;
import com.cms.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExaminationServiceImpl implements ExaminationService {

    private final ExaminationRepository examinationRepository;
    private final ExamSubjectRepository examSubjectRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final ExaminationMapper examinationMapper;
    private final ExamSubjectMapper examSubjectMapper;

    @Override
    @Transactional
    public ExaminationResponse scheduleExamination(ExaminationRequest request, String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Examination examination = examinationMapper.toEntity(request);
        examination.setCreatedBy(user);
        examination.setStatus(ExaminationStatus.SCHEDULED);
        
        return examinationMapper.toResponse(examinationRepository.save(examination));
    }

    @Override
    @Transactional
    public ExaminationResponse updateExamination(Long id, ExaminationRequest request) {
        Examination examination = getExaminationEntity(id);
        examinationMapper.updateEntityFromRequest(request, examination);
        return examinationMapper.toResponse(examinationRepository.save(examination));
    }

    @Override
    @Transactional
    public ExaminationResponse updateStatus(Long id, ExaminationStatus status) {
        Examination examination = getExaminationEntity(id);
        examination.setStatus(status);
        return examinationMapper.toResponse(examinationRepository.save(examination));
    }

    @Override
    public ExaminationResponse getExamination(Long id) {
        return examinationMapper.toResponse(getExaminationEntity(id));
    }

    @Override
    public Page<ExaminationResponse> getAllExaminations(Pageable pageable) {
        return examinationRepository.findAll(pageable).map(examinationMapper::toResponse);
    }

    @Override
    @Transactional
    public ExamSubjectResponse addSubjectToExamination(Long examinationId, ExamSubjectRequest request) {
        Examination examination = getExaminationEntity(examinationId);
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subject not found"));

        ExamSubject examSubject = examSubjectMapper.toEntity(request);
        examSubject.setExamination(examination);
        examSubject.setSubject(subject);
        
        return examSubjectMapper.toResponse(examSubjectRepository.save(examSubject));
    }

    @Override
    public List<ExamSubjectResponse> getExaminationSubjects(Long examinationId) {
        return examSubjectRepository.findByExaminationId(examinationId).stream()
                .map(examSubjectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void removeSubjectFromExamination(Long examSubjectId) {
        if (!examSubjectRepository.existsById(examSubjectId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ExamSubject not found");
        }
        examSubjectRepository.deleteById(examSubjectId);
    }

    private Examination getExaminationEntity(Long id) {
        return examinationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Examination not found"));
    }
}
