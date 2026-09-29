package com.cms.module.department.service.impl;

import com.cms.common.PageResponse;
import com.cms.exception.DuplicateResourceException;
import com.cms.exception.ResourceNotFoundException;
import com.cms.module.college.entity.College;
import com.cms.module.college.repository.CollegeRepository;
import com.cms.module.department.dto.DepartmentRequest;
import com.cms.module.department.dto.DepartmentResponse;
import com.cms.module.department.dto.DepartmentSummaryResponse;
import com.cms.module.department.entity.Department;
import com.cms.module.department.mapper.DepartmentMapper;
import com.cms.module.department.repository.DepartmentRepository;
import com.cms.module.department.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final CollegeRepository collegeRepository;
    private final DepartmentMapper departmentMapper;

    @Override
    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        log.info("Creating department with code: {}", request.getCode());
        
        College college = collegeRepository.findById(request.getCollegeId())
                .orElseThrow(() -> new ResourceNotFoundException("College", "id", request.getCollegeId()));

        if (departmentRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Department", "code", request.getCode());
        }
        if (departmentRepository.existsByNameAndCollegeId(request.getName(), request.getCollegeId())) {
            throw new DuplicateResourceException("Department", "name + college", request.getName() + " in " + college.getName());
        }

        Department department = departmentMapper.toEntity(request);
        department.setCollege(college);
        if (department.getIsActive() == null) {
            department.setIsActive(true);
        }

        Department savedDepartment = departmentRepository.save(department);
        return departmentMapper.toResponse(savedDepartment);
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentResponse getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        return departmentMapper.toResponse(department);
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentResponse getDepartmentByCode(String code) {
        Department department = departmentRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "code", code));
        return departmentMapper.toResponse(department);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<DepartmentSummaryResponse> getAllDepartments(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Department> departments = departmentRepository.findAll(pageable);
        
        List<DepartmentSummaryResponse> content = departments.getContent().stream()
                .map(departmentMapper::toSummaryResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                departments.getNumber(),
                departments.getSize(),
                departments.getTotalElements(),
                departments.getTotalPages(),
                departments.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<DepartmentSummaryResponse> getDepartmentsByCollege(Long collegeId, int page, int size, String sortBy, String sortDir) {
        if (!collegeRepository.existsById(collegeId)) {
            throw new ResourceNotFoundException("College", "id", collegeId);
        }
        
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Department> departments = departmentRepository.findByCollegeId(collegeId, pageable);
        
        List<DepartmentSummaryResponse> content = departments.getContent().stream()
                .map(departmentMapper::toSummaryResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                departments.getNumber(),
                departments.getSize(),
                departments.getTotalElements(),
                departments.getTotalPages(),
                departments.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentSummaryResponse> getActiveDepartmentsByCollege(Long collegeId) {
        if (!collegeRepository.existsById(collegeId)) {
            throw new ResourceNotFoundException("College", "id", collegeId);
        }
        
        return departmentRepository.findByCollegeIdAndIsActive(collegeId, true).stream()
                .map(departmentMapper::toSummaryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<DepartmentSummaryResponse> searchDepartments(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Department> departments = departmentRepository.findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(query, query, pageable);
        
        List<DepartmentSummaryResponse> content = departments.getContent().stream()
                .map(departmentMapper::toSummaryResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                departments.getNumber(),
                departments.getSize(),
                departments.getTotalElements(),
                departments.getTotalPages(),
                departments.isLast()
        );
    }

    @Override
    @Transactional
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        log.info("Updating department with id: {}", id);
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));

        College college = collegeRepository.findById(request.getCollegeId())
                .orElseThrow(() -> new ResourceNotFoundException("College", "id", request.getCollegeId()));

        if (!department.getCode().equals(request.getCode()) && departmentRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Department", "code", request.getCode());
        }
        
        if ((!department.getName().equals(request.getName()) || !department.getCollege().getId().equals(request.getCollegeId())) 
                && departmentRepository.existsByNameAndCollegeId(request.getName(), request.getCollegeId())) {
            throw new DuplicateResourceException("Department", "name + college", request.getName() + " in " + college.getName());
        }

        departmentMapper.updateEntityFromRequest(request, department);
        department.setCollege(college);
        
        Department updatedDepartment = departmentRepository.save(department);
        return departmentMapper.toResponse(updatedDepartment);
    }

    @Override
    @Transactional
    public void deleteDepartment(Long id) {
        log.info("Deleting department with id: {}", id);
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        departmentRepository.delete(department);
    }

    @Override
    @Transactional
    public void toggleDepartmentStatus(Long id) {
        log.info("Toggling active status for department with id: {}", id);
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        department.setIsActive(!department.getIsActive());
        departmentRepository.save(department);
    }
}
