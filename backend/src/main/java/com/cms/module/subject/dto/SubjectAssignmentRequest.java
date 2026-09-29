package com.cms.module.subject.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class SubjectAssignmentRequest {
    @NotNull(message = "Professor ID is required")
    private Long professorId;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    @NotNull(message = "Semester is required")
    private Integer semester;

    @NotNull(message = "Assigned date is required")
    private LocalDate assignedDate;

    @NotBlank(message = "Status is required")
    private String status;
}
