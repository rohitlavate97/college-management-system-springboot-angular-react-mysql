package com.cms.module.dashboard.service.impl;

import com.cms.module.dashboard.dto.AdminDashboardResponse;
import com.cms.module.dashboard.dto.ProfessorDashboardResponse;
import com.cms.module.dashboard.dto.StudentDashboardResponse;
import com.cms.module.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardServiceImpl implements DashboardService {

    @Override
    @Cacheable(value = "dashboardStats", key = "'admin'")
    public AdminDashboardResponse getAdminDashboard() {
        log.info("Fetching admin dashboard stats");
        AdminDashboardResponse response = new AdminDashboardResponse();
        // TODO: Wire up actual repositories
        response.setTotalStudents(0);
        response.setTotalProfessors(0);
        response.setTotalDepartments(0);
        response.setActiveCourses(0);
        response.setPendingFeesCount(0);
        response.setAttendanceRate(0.0);
        return response;
    }

    @Override
    @Cacheable(value = "dashboardStats", key = "'professor_' + #professorId")
    public ProfessorDashboardResponse getProfessorDashboard(Long professorId) {
        log.info("Fetching professor dashboard stats for {}", professorId);
        ProfessorDashboardResponse response = new ProfessorDashboardResponse();
        response.setAssignedSubjects(0);
        response.setTotalStudentsTaught(0);
        response.setRecentAttendances(0);
        return response;
    }

    @Override
    @Cacheable(value = "dashboardStats", key = "'student_' + #studentId")
    public StudentDashboardResponse getStudentDashboard(Long studentId) {
        log.info("Fetching student dashboard stats for {}", studentId);
        StudentDashboardResponse response = new StudentDashboardResponse();
        response.setCurrentEnrolledCourses(0);
        response.setAttendancePercentage(0.0);
        response.setPendingFeeAmount(0.0);
        response.setRecentExamResults(0);
        return response;
    }
}
