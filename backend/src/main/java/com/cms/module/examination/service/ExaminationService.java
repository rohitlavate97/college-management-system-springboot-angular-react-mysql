package com.cms.module.examination.service;

import com.cms.module.examination.dto.ExamSubjectRequest;
import com.cms.module.examination.dto.ExamSubjectResponse;
import com.cms.module.examination.dto.ExaminationRequest;
import com.cms.module.examination.dto.ExaminationResponse;
import com.cms.module.examination.enums.ExaminationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ExaminationService {
    ExaminationResponse scheduleExamination(ExaminationRequest request, String currentUserEmail);
    ExaminationResponse updateExamination(Long id, ExaminationRequest request);
    ExaminationResponse updateStatus(Long id, ExaminationStatus status);
    ExaminationResponse getExamination(Long id);
    Page<ExaminationResponse> getAllExaminations(Pageable pageable);
    
    ExamSubjectResponse addSubjectToExamination(Long examinationId, ExamSubjectRequest request);
    List<ExamSubjectResponse> getExaminationSubjects(Long examinationId);
    void removeSubjectFromExamination(Long examSubjectId);
}
