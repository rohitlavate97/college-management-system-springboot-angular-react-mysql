package com.cms.module.student.controller;

import com.cms.module.student.dto.EnrollmentRequest;
import com.cms.module.student.dto.EnrollmentResponse;
import com.cms.module.student.dto.StudentRequest;
import com.cms.module.student.dto.StudentResponse;
import com.cms.module.student.dto.StudentSummaryResponse;
import com.cms.module.student.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@Tag(name = "Student Management", description = "APIs for managing students and enrollments")
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Create a new student")
    public ResponseEntity<StudentResponse> createStudent(@Valid @RequestBody StudentRequest request) {
        return new ResponseEntity<>(studentService.createStudent(request), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'PROFESSOR', 'LIBRARIAN')")
    @Operation(summary = "Get all students with pagination")
    public ResponseEntity<Page<StudentSummaryResponse>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(studentService.getAllStudents(page, size, sortBy, sortDir));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'PROFESSOR') or (hasRole('STUDENT') and @securityService.isStudentOwner(#id))")
    @Operation(summary = "Get student by ID")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping("/roll-number/{rollNumber}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'PROFESSOR')")
    @Operation(summary = "Get student by roll number")
    public ResponseEntity<StudentResponse> getStudentByRollNumber(@PathVariable String rollNumber) {
        return ResponseEntity.ok(studentService.getStudentByRollNumber(rollNumber));
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'PROFESSOR')")
    @Operation(summary = "Get students by department")
    public ResponseEntity<Page<StudentSummaryResponse>> getStudentsByDepartment(
            @PathVariable Long departmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(studentService.getStudentsByDepartment(departmentId, page, size));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'PROFESSOR')")
    @Operation(summary = "Get students by course")
    public ResponseEntity<Page<StudentSummaryResponse>> getStudentsByCourse(
            @PathVariable Long courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(studentService.getStudentsByCourse(courseId, page, size));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'PROFESSOR')")
    @Operation(summary = "Search students by name, roll number, or registration number")
    public ResponseEntity<Page<StudentSummaryResponse>> searchStudents(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(studentService.searchStudents(query, page, size));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Update student details")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request) {
        return ResponseEntity.ok(studentService.updateStudent(id, request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Update student status")
    public ResponseEntity<StudentResponse> updateStudentStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(studentService.updateStudentStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Delete student")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/enrollments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD')")
    @Operation(summary = "Enroll student in a subject")
    public ResponseEntity<EnrollmentResponse> enrollStudent(
            @PathVariable Long id,
            @Valid @RequestBody EnrollmentRequest request) {
        return new ResponseEntity<>(studentService.enrollStudent(id, request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/enrollments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'PROFESSOR') or (hasRole('STUDENT') and @securityService.isStudentOwner(#id))")
    @Operation(summary = "Get all enrollments for a student")
    public ResponseEntity<List<EnrollmentResponse>> getStudentEnrollments(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentEnrollments(id));
    }
}
