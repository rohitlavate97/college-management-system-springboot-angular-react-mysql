package com.cms.module.examination.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ExamSubjectResponse {
    private Long id;
    private Long examinationId;
    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private LocalDate examDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String room;
    private BigDecimal maxMarks;
    private BigDecimal passingMarks;
}
