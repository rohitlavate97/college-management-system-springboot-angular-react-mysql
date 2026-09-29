package com.cms.module.student.repository;

import com.cms.module.student.entity.Student;
import com.cms.module.student.entity.StudentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByRollNumber(String rollNumber);

    Optional<Student> findByRegistrationNumber(String registrationNumber);

    Page<Student> findByDepartmentId(Long departmentId, Pageable pageable);

    Page<Student> findByCourseId(Long courseId, Pageable pageable);
    java.util.List<Student> findAllByCourseId(Long courseId);

    Page<Student> findByStatus(StudentStatus status, Pageable pageable);

    Optional<Student> findByUserId(Long userId);

    @Query("SELECT s FROM Student s JOIN s.user u WHERE " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.registrationNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Student> search(@Param("query") String query, Pageable pageable);
}
