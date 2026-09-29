package com.cms.module.subject.repository;

import com.cms.module.subject.entity.Subject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByCode(String code);
    boolean existsByCode(String code);
    
    @Query("SELECT s FROM Subject s WHERE " +
           "(:query IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.code) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:departmentId IS NULL OR s.department.id = :departmentId) AND " +
           "(:courseId IS NULL OR s.course.id = :courseId) AND " +
           "(:semester IS NULL OR s.semester = :semester) AND " +
           "(:isActive IS NULL OR s.isActive = :isActive)")
    Page<Subject> search(@Param("query") String query, 
                         @Param("departmentId") Long departmentId, 
                         @Param("courseId") Long courseId,
                         @Param("semester") Integer semester,
                         @Param("isActive") Boolean isActive, 
                         Pageable pageable);
}
