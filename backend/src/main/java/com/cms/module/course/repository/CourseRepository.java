package com.cms.module.course.repository;

import com.cms.module.course.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCode(String code);
    boolean existsByCode(String code);
    Page<Course> findByDepartmentId(Long departmentId, Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE " +
           "(:query IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.code) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:departmentId IS NULL OR c.department.id = :departmentId) AND " +
           "(:isActive IS NULL OR c.isActive = :isActive)")
    Page<Course> search(@Param("query") String query, 
                        @Param("departmentId") Long departmentId, 
                        @Param("isActive") Boolean isActive, 
                        Pageable pageable);
}
