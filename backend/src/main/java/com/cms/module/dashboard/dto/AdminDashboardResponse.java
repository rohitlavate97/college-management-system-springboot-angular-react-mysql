package com.cms.module.dashboard.dto;

import lombok.Data;

@Data
public class AdminDashboardResponse {
    private long totalStudents;
    private long totalProfessors;
    private long totalDepartments;
    private long activeCourses;
    private long pendingFeesCount;
    private double attendanceRate;
}
