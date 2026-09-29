package com.cms.module.student.service;

import com.cms.module.student.dto.EnrollmentRequest;
import com.cms.module.student.dto.EnrollmentResponse;
import com.cms.module.student.dto.StudentRequest;
import com.cms.module.student.dto.StudentResponse;
import com.cms.module.student.dto.StudentSummaryResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface StudentService {
    StudentResponse createStudent(StudentRequest request);
    StudentResponse getStudentById(Long id);
    StudentResponse getStudentByRollNumber(String rollNumber);
    Page<StudentSummaryResponse> getAllStudents(int page, int size, String sortBy, String sortDir);
    Page<StudentSummaryResponse> getStudentsByDepartment(Long departmentId, int page, int size);
    Page<StudentSummaryResponse> getStudentsByCourse(Long courseId, int page, int size);
    Page<StudentSummaryResponse> searchStudents(String query, int page, int size);
    StudentResponse updateStudent(Long id, StudentRequest request);
    StudentResponse updateStudentStatus(Long id, String status);
    void deleteStudent(Long id);
    
    EnrollmentResponse enrollStudent(Long studentId, EnrollmentRequest request);
    List<EnrollmentResponse> getStudentEnrollments(Long studentId);
}
