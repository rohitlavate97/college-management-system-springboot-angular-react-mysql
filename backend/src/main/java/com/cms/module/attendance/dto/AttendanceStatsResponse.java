package com.cms.module.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceStatsResponse {
    private Long studentId;
    private String studentName;
    private Long subjectId;
    private String subjectName;
    private long totalClasses;
    private long attendedClasses;
    private double attendancePercentage;
}
