package com.cms.module.examination.dto;

import com.cms.module.examination.enums.ExaminationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ExaminationRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String academicYear;
    @NotNull
    private Integer semester;
    @NotNull
    private ExaminationType examType;
    @NotNull
    private LocalDate startDate;
    @NotNull
    private LocalDate endDate;
    private String description;
}
