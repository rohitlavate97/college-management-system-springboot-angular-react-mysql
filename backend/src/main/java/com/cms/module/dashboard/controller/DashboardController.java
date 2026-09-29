package com.cms.module.dashboard.controller;

import com.cms.module.dashboard.dto.AdminDashboardResponse;
import com.cms.module.dashboard.dto.ProfessorDashboardResponse;
import com.cms.module.dashboard.dto.StudentDashboardResponse;
import com.cms.module.dashboard.service.DashboardService;
import com.cms.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard analytics APIs")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    @Operation(summary = "Get admin dashboard analytics")
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    @GetMapping("/professor")
    @PreAuthorize("hasRole('PROFESSOR') or hasRole('HOD')")
    @Operation(summary = "Get professor dashboard analytics")
    public ResponseEntity<ProfessorDashboardResponse> getProfessorDashboard(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(dashboardService.getProfessorDashboard(userDetails.getId()));
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get student dashboard analytics")
    public ResponseEntity<StudentDashboardResponse> getStudentDashboard(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(dashboardService.getStudentDashboard(userDetails.getId()));
    }
}
