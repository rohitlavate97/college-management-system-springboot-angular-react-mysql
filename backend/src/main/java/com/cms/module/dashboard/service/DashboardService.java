package com.cms.module.dashboard.service;

import com.cms.module.dashboard.dto.AdminDashboardResponse;
import com.cms.module.dashboard.dto.ProfessorDashboardResponse;
import com.cms.module.dashboard.dto.StudentDashboardResponse;

public interface DashboardService {
    AdminDashboardResponse getAdminDashboard();
    ProfessorDashboardResponse getProfessorDashboard(Long professorId);
    StudentDashboardResponse getStudentDashboard(Long studentId);
}
