package com.cms.module.subject.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubjectRequest {
    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    private Long courseId;

    @NotNull(message = "Semester is required")
    @Min(1)
    private Integer semester;

    @NotNull(message = "Credits are required")
    @Min(1)
    private Integer credits;

    @NotBlank(message = "Subject type is required")
    private String subjectType;

    private Boolean isActive;
}
