package com.cms.module.college.repository;

import com.cms.module.college.entity.College;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CollegeRepository extends JpaRepository<College, Long> {
    Optional<College> findByCode(String code);
    Optional<College> findByName(String name);
    boolean existsByCode(String code);
    boolean existsByName(String name);
    Page<College> findByIsActive(Boolean isActive, Pageable pageable);
    Page<College> findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(String name, String code, Pageable pageable);
}
