package com.cms.module.examination.controller;

import com.cms.module.examination.dto.ExamSubjectRequest;
import com.cms.module.examination.dto.ExamSubjectResponse;
import com.cms.module.examination.dto.ExaminationRequest;
import com.cms.module.examination.dto.ExaminationResponse;
import com.cms.module.examination.enums.ExaminationStatus;
import com.cms.module.examination.service.ExaminationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/examinations")
@Tag(name = "Examinations", description = "Examination Management APIs")
@RequiredArgsConstructor
public class ExaminationController {

    private final ExaminationService examinationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD')")
    @Operation(summary = "Schedule a new examination")
    public ResponseEntity<ExaminationResponse> scheduleExamination(@Valid @RequestBody ExaminationRequest request, Principal principal) {
        return ResponseEntity.ok(examinationService.scheduleExamination(request, principal.getName()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD')")
    @Operation(summary = "Update examination")
    public ResponseEntity<ExaminationResponse> updateExamination(@PathVariable Long id, @Valid @RequestBody ExaminationRequest request) {
        return ResponseEntity.ok(examinationService.updateExamination(id, request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD')")
    @Operation(summary = "Update examination status")
    public ResponseEntity<ExaminationResponse> updateStatus(@PathVariable Long id, @RequestParam ExaminationStatus status) {
        return ResponseEntity.ok(examinationService.updateStatus(id, status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'PROFESSOR', 'STUDENT')")
    @Operation(summary = "Get examination by ID")
    public ResponseEntity<ExaminationResponse> getExamination(@PathVariable Long id) {
        return ResponseEntity.ok(examinationService.getExamination(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'PROFESSOR', 'STUDENT')")
    @Operation(summary = "Get all examinations")
    public ResponseEntity<Page<ExaminationResponse>> getAllExaminations(Pageable pageable) {
        return ResponseEntity.ok(examinationService.getAllExaminations(pageable));
    }

    @PostMapping("/{id}/subjects")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD')")
    @Operation(summary = "Add subject to examination")
    public ResponseEntity<ExamSubjectResponse> addSubject(@PathVariable Long id, @Valid @RequestBody ExamSubjectRequest request) {
        return ResponseEntity.ok(examinationService.addSubjectToExamination(id, request));
    }

    @GetMapping("/{id}/subjects")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'PROFESSOR', 'STUDENT')")
    @Operation(summary = "Get subjects for examination")
    public ResponseEntity<List<ExamSubjectResponse>> getSubjects(@PathVariable Long id) {
        return ResponseEntity.ok(examinationService.getExaminationSubjects(id));
    }

    @DeleteMapping("/subjects/{subjectId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD')")
    @Operation(summary = "Remove subject from examination")
    public ResponseEntity<Void> removeSubject(@PathVariable Long subjectId) {
        examinationService.removeSubjectFromExamination(subjectId);
        return ResponseEntity.noContent().build();
    }
}
