package com.cms.module.department.service;

import com.cms.common.PageResponse;
import com.cms.module.department.dto.DepartmentRequest;
import com.cms.module.department.dto.DepartmentResponse;
import com.cms.module.department.dto.DepartmentSummaryResponse;

import java.util.List;

public interface DepartmentService {
    DepartmentResponse createDepartment(DepartmentRequest request);
    DepartmentResponse getDepartmentById(Long id);
    DepartmentResponse getDepartmentByCode(String code);
    PageResponse<DepartmentSummaryResponse> getAllDepartments(int page, int size, String sortBy, String sortDir);
    PageResponse<DepartmentSummaryResponse> getDepartmentsByCollege(Long collegeId, int page, int size, String sortBy, String sortDir);
    List<DepartmentSummaryResponse> getActiveDepartmentsByCollege(Long collegeId);
    PageResponse<DepartmentSummaryResponse> searchDepartments(String query, int page, int size);
    DepartmentResponse updateDepartment(Long id, DepartmentRequest request);
    void deleteDepartment(Long id);
    void toggleDepartmentStatus(Long id);
}
