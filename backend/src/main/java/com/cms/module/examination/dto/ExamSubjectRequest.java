package com.cms.module.examination.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ExamSubjectRequest {
    @NotNull
    private Long subjectId;
    @NotNull
    private LocalDate examDate;
    @NotNull
    private LocalTime startTime;
    @NotNull
    private LocalTime endTime;
    private String room;
    @NotNull
    private BigDecimal maxMarks;
    @NotNull
    private BigDecimal passingMarks;
}
