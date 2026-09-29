package com.cms.module.college.controller;

import com.cms.common.PageResponse;
import com.cms.module.college.dto.CollegeRequest;
import com.cms.module.college.dto.CollegeResponse;
import com.cms.module.college.dto.CollegeSummaryResponse;
import com.cms.module.college.service.CollegeService;
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

@RestController
@RequestMapping("/api/v1/colleges")
@RequiredArgsConstructor
@Tag(name = "College Management", description = "Endpoints for managing colleges")
public class CollegeController {

    private final CollegeService collegeService;

    @PostMapping
    @Operation(summary = "Create a new college")
    public ResponseEntity<CollegeResponse> createCollege(@Valid @RequestBody CollegeRequest request) {
        return new ResponseEntity<>(collegeService.createCollege(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a college by ID")
    public ResponseEntity<CollegeResponse> getCollegeById(@PathVariable Long id) {
        return ResponseEntity.ok(collegeService.getCollegeById(id));
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get a college by Code")
    public ResponseEntity<CollegeResponse> getCollegeByCode(@PathVariable String code) {
        return ResponseEntity.ok(collegeService.getCollegeByCode(code));
    }

    @GetMapping
    @Operation(summary = "Get all colleges with pagination")
    public ResponseEntity<PageResponse<CollegeSummaryResponse>> getAllColleges(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(collegeService.getAllColleges(page, size, sortBy, sortDir));
    }

    @GetMapping("/search")
    @Operation(summary = "Search colleges by name or code")
    public ResponseEntity<PageResponse<CollegeSummaryResponse>> searchColleges(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(collegeService.searchColleges(query, page, size));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing college")
    public ResponseEntity<CollegeResponse> updateCollege(@PathVariable Long id, @Valid @RequestBody CollegeRequest request) {
        return ResponseEntity.ok(collegeService.updateCollege(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a college")
    public ResponseEntity<Void> deleteCollege(@PathVariable Long id) {
        collegeService.deleteCollege(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Toggle active status of a college")
    public ResponseEntity<Void> toggleCollegeStatus(@PathVariable Long id) {
        collegeService.toggleCollegeStatus(id);
        return ResponseEntity.noContent().build();
    }
}
