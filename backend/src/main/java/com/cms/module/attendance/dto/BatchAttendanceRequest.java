package com.cms.module.attendance.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BatchAttendanceRequest {
    
    @NotNull(message = "Subject ID is required")
    private Long subjectId;
    
    @NotNull(message = "Professor ID is required")
    private Long professorId;
    
    @NotNull(message = "Attendance date is required")
    private LocalDate attendanceDate;
    
    @NotEmpty(message = "Attendance records cannot be empty")
    @Valid
    private List<AttendanceRecordRequest> records;
}
