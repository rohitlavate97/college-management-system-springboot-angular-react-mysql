package com.cms.module.dashboard.dto;

import lombok.Data;

@Data
public class StudentDashboardResponse {
    private long currentEnrolledCourses;
    private double attendancePercentage;
    private double pendingFeeAmount;
    private long recentExamResults;
}
