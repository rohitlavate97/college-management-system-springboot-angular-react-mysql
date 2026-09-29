package com.cms.module.department.repository;

import com.cms.module.department.entity.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByCode(String code);
    boolean existsByCode(String code);
    boolean existsByNameAndCollegeId(String name, Long collegeId);
    Page<Department> findByCollegeId(Long collegeId, Pageable pageable);
    Page<Department> findByIsActive(Boolean isActive, Pageable pageable);
    Page<Department> findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(String name, String code, Pageable pageable);
    List<Department> findByCollegeIdAndIsActive(Long collegeId, Boolean isActive);
}
