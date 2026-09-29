package com.cms.module.course.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CourseRequest {
    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Duration in years is required")
    @Min(1)
    private Integer durationYears;

    @NotNull(message = "Total semesters is required")
    @Min(1)
    private Integer totalSemesters;

    @NotBlank(message = "Degree type is required")
    private String degreeType;

    private Boolean isActive;
}
