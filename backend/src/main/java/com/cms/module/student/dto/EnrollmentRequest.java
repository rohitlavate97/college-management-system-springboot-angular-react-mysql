package com.cms.module.student.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EnrollmentRequest {
    @NotNull(message = "Subject ID is required")
    private Long subjectId;
    
    @NotBlank(message = "Academic year is required")
    private String academicYear;
    
    @NotNull(message = "Semester is required")
    private Integer semester;
    
    @NotNull(message = "Enrolled date is required")
    private LocalDate enrolledDate;
}
