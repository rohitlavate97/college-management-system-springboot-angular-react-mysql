package com.cms.module.department.service;

import com.cms.common.PageResponse;
import com.cms.exception.ResourceNotFoundException;
import com.cms.module.college.entity.College;
import com.cms.module.college.repository.CollegeRepository;
import com.cms.module.department.dto.DepartmentRequest;
import com.cms.module.department.dto.DepartmentResponse;
import com.cms.module.department.dto.DepartmentSummaryResponse;
import com.cms.module.department.entity.Department;
import com.cms.module.department.mapper.DepartmentMapper;
import com.cms.module.department.repository.DepartmentRepository;
import com.cms.module.department.service.impl.DepartmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DepartmentServiceTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private CollegeRepository collegeRepository;

    @Mock
    private DepartmentMapper departmentMapper;

    @InjectMocks
    private DepartmentServiceImpl departmentService;

    private DepartmentRequest departmentRequest;
    private Department department;
    private DepartmentResponse departmentResponse;
    private College college;

    @BeforeEach
    void setUp() {
        departmentRequest = new DepartmentRequest();
        departmentRequest.setCode("CS01");
        departmentRequest.setName("Computer Science");
        departmentRequest.setCollegeId(1L);

        college = new College();
        college.setId(1L);
        college.setName("Test College");

        department = new Department();
        department.setId(1L);
        department.setCode("CS01");
        department.setName("Computer Science");
        department.setCollege(college);

        departmentResponse = new DepartmentResponse();
        departmentResponse.setId(1L);
        departmentResponse.setCode("CS01");
        departmentResponse.setName("Computer Science");
    }

    @Test
    void createDepartment_Success() {
        when(collegeRepository.findById(1L)).thenReturn(Optional.of(college));
        when(departmentRepository.existsByCode("CS01")).thenReturn(false);
        when(departmentRepository.existsByNameAndCollegeId("Computer Science", 1L)).thenReturn(false);
        when(departmentMapper.toEntity(departmentRequest)).thenReturn(department);
        when(departmentRepository.save(any(Department.class))).thenReturn(department);
        when(departmentMapper.toResponse(department)).thenReturn(departmentResponse);

        DepartmentResponse result = departmentService.createDepartment(departmentRequest);

        assertNotNull(result);
        assertEquals("CS01", result.getCode());
        verify(departmentRepository).save(any(Department.class));
    }

    @Test
    void createDepartment_InvalidCollegeId_ThrowsException() {
        when(collegeRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> departmentService.createDepartment(departmentRequest));
        verify(departmentRepository, never()).save(any(Department.class));
    }

    @Test
    void getAllDepartments_Pagination_Success() {
        Pageable pageable = PageRequest.of(0, 10, org.springframework.data.domain.Sort.by("id").ascending());
        Page<Department> page = new PageImpl<>(List.of(department), pageable, 1);
        
        DepartmentSummaryResponse summary = new DepartmentSummaryResponse();
        summary.setId(1L);
        summary.setCode("CS01");
        
        when(departmentRepository.findAll(any(Pageable.class))).thenReturn(page);
        when(departmentMapper.toSummaryResponse(department)).thenReturn(summary);

        PageResponse<DepartmentSummaryResponse> result = departmentService.getAllDepartments(0, 10, "id", "asc");

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(1, result.getTotalElements());
        assertEquals(0, result.getPageNo());
        assertEquals(10, result.getPageSize());
    }
}
