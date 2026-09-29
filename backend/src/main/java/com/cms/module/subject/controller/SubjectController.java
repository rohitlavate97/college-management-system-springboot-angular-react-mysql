package com.cms.module.subject.controller;

import com.cms.common.PageResponse;
import com.cms.module.subject.dto.SubjectAssignmentRequest;
import com.cms.module.subject.dto.SubjectAssignmentResponse;
import com.cms.module.subject.dto.SubjectRequest;
import com.cms.module.subject.dto.SubjectResponse;
import com.cms.module.subject.dto.SubjectSummaryResponse;
import com.cms.module.subject.service.SubjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/subjects")
@RequiredArgsConstructor
@Tag(name = "Subject Management", description = "APIs for managing subjects and professor assignments")
public class SubjectController {

    private final SubjectService subjectService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Create a new subject")
    public ResponseEntity<SubjectResponse> createSubject(@Valid @RequestBody SubjectRequest request) {
        return new ResponseEntity<>(subjectService.createSubject(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Update an existing subject")
    public ResponseEntity<SubjectResponse> updateSubject(
            @PathVariable Long id, 
            @Valid @RequestBody SubjectRequest request) {
        return ResponseEntity.ok(subjectService.updateSubject(id, request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'PROFESSOR', 'STUDENT')")
    @Operation(summary = "Get subject by ID")
    public ResponseEntity<SubjectResponse> getSubjectById(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.getSubjectById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Delete a subject")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'PROFESSOR', 'STUDENT')")
    @Operation(summary = "Search subjects with pagination and filtering")
    public ResponseEntity<PageResponse<SubjectSummaryResponse>> searchSubjects(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Integer semester,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(subjectService.searchSubjects(query, departmentId, courseId, semester, isActive, page, size, sortBy, sortDir));
    }

    @PostMapping("/assignments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD')")
    @Operation(summary = "Assign a professor to a subject")
    public ResponseEntity<SubjectAssignmentResponse> assignProfessor(@Valid @RequestBody SubjectAssignmentRequest request) {
        return new ResponseEntity<>(subjectService.assignProfessor(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/assignments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'PROFESSOR')")
    @Operation(summary = "Get all professor assignments for a subject")
    public ResponseEntity<List<SubjectAssignmentResponse>> getAssignmentsBySubject(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.getAssignmentsBySubject(id));
    }

    @DeleteMapping("/assignments/{assignmentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD')")
    @Operation(summary = "Delete a subject assignment")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long assignmentId) {
        subjectService.deleteAssignment(assignmentId);
        return ResponseEntity.noContent().build();
    }
}
