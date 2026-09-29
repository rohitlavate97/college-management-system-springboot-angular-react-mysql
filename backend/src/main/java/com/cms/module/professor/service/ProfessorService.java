package com.cms.module.professor.service;

import com.cms.common.PageResponse;
import com.cms.module.professor.dto.ProfessorRequest;
import com.cms.module.professor.dto.ProfessorResponse;
import com.cms.module.professor.dto.ProfessorSummaryResponse;

public interface ProfessorService {
    ProfessorResponse createProfessor(ProfessorRequest request);
    ProfessorResponse getProfessorById(Long id);
    ProfessorResponse getProfessorByEmployeeId(String employeeId);
    PageResponse<ProfessorSummaryResponse> getAllProfessors(int page, int size, String sortBy, String sortDir);
    PageResponse<ProfessorSummaryResponse> getProfessorsByDepartment(Long departmentId, int page, int size);
    PageResponse<ProfessorSummaryResponse> searchProfessors(String query, int page, int size);
    ProfessorResponse updateProfessor(Long id, ProfessorRequest request);
    void deleteProfessor(Long id);
    ProfessorResponse updateProfessorStatus(Long id, String status);
}
