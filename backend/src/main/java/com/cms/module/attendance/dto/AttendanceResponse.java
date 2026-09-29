package com.cms.module.attendance.dto;

import com.cms.module.attendance.entity.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Long subjectId;
    private String subjectName;
    private Long professorId;
    private String professorName;
    private LocalDate attendanceDate;
    private AttendanceStatus status;
    private String remarks;
    private LocalDateTime markedAt;
}
