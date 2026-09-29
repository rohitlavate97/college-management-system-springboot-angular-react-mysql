package com.cms.module.dashboard.dto;

import lombok.Data;

@Data
public class ProfessorDashboardResponse {
    private long assignedSubjects;
    private long totalStudentsTaught;
    private long recentAttendances;
}
