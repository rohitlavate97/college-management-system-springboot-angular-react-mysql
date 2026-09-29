package com.cms.module.department.controller;

import com.cms.common.PageResponse;
import com.cms.module.department.dto.DepartmentRequest;
import com.cms.module.department.dto.DepartmentResponse;
import com.cms.module.department.dto.DepartmentSummaryResponse;
import com.cms.module.department.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
@Tag(name = "Department Management", description = "Endpoints for managing departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    @Operation(summary = "Create a new department")
    public ResponseEntity<DepartmentResponse> createDepartment(@Valid @RequestBody DepartmentRequest request) {
        return new ResponseEntity<>(departmentService.createDepartment(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a department by ID")
    public ResponseEntity<DepartmentResponse> getDepartmentById(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getDepartmentById(id));
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get a department by Code")
    public ResponseEntity<DepartmentResponse> getDepartmentByCode(@PathVariable String code) {
        return ResponseEntity.ok(departmentService.getDepartmentByCode(code));
    }

    @GetMapping
    @Operation(summary = "Get all departments with pagination")
    public ResponseEntity<PageResponse<DepartmentSummaryResponse>> getAllDepartments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(departmentService.getAllDepartments(page, size, sortBy, sortDir));
    }

    @GetMapping("/college/{collegeId}")
    @Operation(summary = "Get departments by College ID with pagination")
    public ResponseEntity<PageResponse<DepartmentSummaryResponse>> getDepartmentsByCollege(
            @PathVariable Long collegeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(departmentService.getDepartmentsByCollege(collegeId, page, size, sortBy, sortDir));
    }

    @GetMapping("/college/{collegeId}/active")
    @Operation(summary = "Get active departments by College ID without pagination")
    public ResponseEntity<List<DepartmentSummaryResponse>> getActiveDepartmentsByCollege(@PathVariable Long collegeId) {
        return ResponseEntity.ok(departmentService.getActiveDepartmentsByCollege(collegeId));
    }

    @GetMapping("/search")
    @Operation(summary = "Search departments by name or code")
    public ResponseEntity<PageResponse<DepartmentSummaryResponse>> searchDepartments(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(departmentService.searchDepartments(query, page, size));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing department")
    public ResponseEntity<DepartmentResponse> updateDepartment(@PathVariable Long id, @Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.ok(departmentService.updateDepartment(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a department")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Toggle active status of a department")
    public ResponseEntity<Void> toggleDepartmentStatus(@PathVariable Long id) {
        departmentService.toggleDepartmentStatus(id);
        return ResponseEntity.noContent().build();
    }
}
