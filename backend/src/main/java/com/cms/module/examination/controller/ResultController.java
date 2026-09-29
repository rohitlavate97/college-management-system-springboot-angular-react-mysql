package com.cms.module.examination.controller;

import com.cms.module.examination.dto.ResultEntryRequest;
import com.cms.module.examination.dto.ResultResponse;
import com.cms.module.examination.dto.StudentReportCardResponse;
import com.cms.module.examination.service.ResultService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/results")
@Tag(name = "Results", description = "Result Management APIs")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @PostMapping("/entry")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'PROFESSOR')")
    @Operation(summary = "Enter marks for students")
    public ResponseEntity<List<ResultResponse>> enterMarks(@Valid @RequestBody ResultEntryRequest request, Principal principal) {
        return ResponseEntity.ok(resultService.enterMarks(request, principal.getName()));
    }

    @GetMapping("/exam-subjects/{examSubjectId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'PROFESSOR')")
    @Operation(summary = "Get results for exam subject")
    public ResponseEntity<List<ResultResponse>> getResultsForExamSubject(@PathVariable Long examSubjectId) {
        return ResponseEntity.ok(resultService.getResultsForExamSubject(examSubjectId));
    }

    @PostMapping("/examinations/{examinationId}/publish")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD')")
    @Operation(summary = "Publish results for examination")
    public ResponseEntity<Void> publishResults(@PathVariable Long examinationId) {
        resultService.publishResults(examinationId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/students/{studentId}/examinations/{examinationId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'STUDENT')")
    @Operation(summary = "Get student report card for specific examination")
    public ResponseEntity<StudentReportCardResponse> getStudentReportCard(
            @PathVariable Long studentId,
            @PathVariable Long examinationId) {
        return ResponseEntity.ok(resultService.getStudentReportCard(studentId, examinationId));
    }

    @GetMapping("/students/{studentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'HOD', 'STUDENT')")
    @Operation(summary = "Get all report cards for student")
    public ResponseEntity<List<StudentReportCardResponse>> getStudentAllReportCards(@PathVariable Long studentId) {
        return ResponseEntity.ok(resultService.getStudentAllReportCards(studentId));
    }
}
