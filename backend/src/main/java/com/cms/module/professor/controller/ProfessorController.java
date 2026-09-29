package com.cms.module.professor.controller;

import com.cms.common.PageResponse;
import com.cms.module.professor.dto.ProfessorRequest;
import com.cms.module.professor.dto.ProfessorResponse;
import com.cms.module.professor.dto.ProfessorSummaryResponse;
import com.cms.module.professor.service.ProfessorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/professors")
@RequiredArgsConstructor
@Tag(name = "Professor API", description = "Professor management endpoints")
public class ProfessorController {

    private final ProfessorService professorService;

    @PostMapping
    @Operation(summary = "Create a new professor")
    public ResponseEntity<ProfessorResponse> createProfessor(@Valid @RequestBody ProfessorRequest request) {
        return new ResponseEntity<>(professorService.createProfessor(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a professor by ID")
    public ResponseEntity<ProfessorResponse> getProfessorById(@PathVariable Long id) {
        return ResponseEntity.ok(professorService.getProfessorById(id));
    }

    @GetMapping("/employee-id/{employeeId}")
    @Operation(summary = "Get a professor by employee ID")
    public ResponseEntity<ProfessorResponse> getProfessorByEmployeeId(@PathVariable String employeeId) {
        return ResponseEntity.ok(professorService.getProfessorByEmployeeId(employeeId));
    }

    @GetMapping
    @Operation(summary = "Get all professors")
    public ResponseEntity<PageResponse<ProfessorSummaryResponse>> getAllProfessors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(professorService.getAllProfessors(page, size, sortBy, sortDir));
    }

    @GetMapping("/department/{departmentId}")
    @Operation(summary = "Get professors by department")
    public ResponseEntity<PageResponse<ProfessorSummaryResponse>> getProfessorsByDepartment(
            @PathVariable Long departmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(professorService.getProfessorsByDepartment(departmentId, page, size));
    }

    @GetMapping("/search")
    @Operation(summary = "Search professors")
    public ResponseEntity<PageResponse<ProfessorSummaryResponse>> searchProfessors(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(professorService.searchProfessors(query, page, size));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a professor")
    public ResponseEntity<ProfessorResponse> updateProfessor(
            @PathVariable Long id, 
            @Valid @RequestBody ProfessorRequest request) {
        return ResponseEntity.ok(professorService.updateProfessor(id, request));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update professor status")
    public ResponseEntity<ProfessorResponse> updateProfessorStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        return ResponseEntity.ok(professorService.updateProfessorStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete (deactivate) a professor")
    public ResponseEntity<Void> deleteProfessor(@PathVariable Long id) {
        professorService.deleteProfessor(id);
        return ResponseEntity.noContent().build();
    }
}
