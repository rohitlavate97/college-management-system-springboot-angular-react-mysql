package com.cms.module.subject.service;

import com.cms.common.PageResponse;
import com.cms.module.subject.dto.SubjectAssignmentRequest;
import com.cms.module.subject.dto.SubjectAssignmentResponse;
import com.cms.module.subject.dto.SubjectRequest;
import com.cms.module.subject.dto.SubjectResponse;
import com.cms.module.subject.dto.SubjectSummaryResponse;

import java.util.List;

public interface SubjectService {
    SubjectResponse createSubject(SubjectRequest request);
    SubjectResponse updateSubject(Long id, SubjectRequest request);
    SubjectResponse getSubjectById(Long id);
    void deleteSubject(Long id);
    PageResponse<SubjectSummaryResponse> searchSubjects(String query, Long departmentId, Long courseId, Integer semester, Boolean isActive, int page, int size, String sortBy, String sortDir);
    
    SubjectAssignmentResponse assignProfessor(SubjectAssignmentRequest request);
    List<SubjectAssignmentResponse> getAssignmentsBySubject(Long subjectId);
    void deleteAssignment(Long assignmentId);
}
