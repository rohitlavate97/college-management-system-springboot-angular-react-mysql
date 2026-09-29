package com.cms.module.professor.repository;

import com.cms.module.professor.entity.Professor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    Optional<Professor> findByEmployeeId(String employeeId);
    boolean existsByEmployeeId(String employeeId);
    Page<Professor> findByDepartmentId(Long departmentId, Pageable pageable);
    Page<Professor> findByStatus(String status, Pageable pageable);
    
    @Query("SELECT p FROM Professor p JOIN p.user u WHERE " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.employeeId) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.department.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Professor> searchProfessors(@Param("query") String query, Pageable pageable);
}
