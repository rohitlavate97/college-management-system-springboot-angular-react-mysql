package com.cms.module.attendance.controller;

import com.cms.module.attendance.dto.AttendanceResponse;
import com.cms.module.attendance.dto.AttendanceStatsResponse;
import com.cms.module.attendance.dto.BatchAttendanceRequest;
import com.cms.module.attendance.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
@Tag(name = "Attendance Management", description = "APIs for managing student attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/batch")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    @Operation(summary = "Mark batch attendance", description = "Mark attendance for multiple students for a subject and date")
    public ResponseEntity<List<AttendanceResponse>> markBatchAttendance(@Valid @RequestBody BatchAttendanceRequest request) {
        return new ResponseEntity<>(attendanceService.markBatchAttendance(request), HttpStatus.CREATED);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PROFESSOR') or (hasRole('STUDENT') and @securityService.isStudentOwner(#studentId))")
    @Operation(summary = "Get student attendance", description = "Get attendance records for a specific student with pagination")
    public ResponseEntity<Page<AttendanceResponse>> getStudentAttendance(
            @PathVariable Long studentId,
            Pageable pageable) {
        return ResponseEntity.ok(attendanceService.getStudentAttendance(studentId, pageable));
    }

    @GetMapping("/subject/{subjectId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PROFESSOR')")
    @Operation(summary = "Get subject attendance", description = "Get attendance records for a specific subject and date")
    public ResponseEntity<List<AttendanceResponse>> getSubjectAttendance(
            @PathVariable Long subjectId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getSubjectAttendance(subjectId, date));
    }

    @GetMapping("/student/{studentId}/stats")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PROFESSOR') or (hasRole('STUDENT') and @securityService.isStudentOwner(#studentId))")
    @Operation(summary = "Get student attendance statistics", description = "Get overall attendance stats or stats for a specific subject if subjectId is provided")
    public ResponseEntity<AttendanceStatsResponse> getStudentStats(
            @PathVariable Long studentId,
            @RequestParam(required = false) Long subjectId) {
        if (subjectId != null) {
            return ResponseEntity.ok(attendanceService.getStudentSubjectStats(studentId, subjectId));
        } else {
            return ResponseEntity.ok(attendanceService.getOverallStudentStats(studentId));
        }
    }
}
