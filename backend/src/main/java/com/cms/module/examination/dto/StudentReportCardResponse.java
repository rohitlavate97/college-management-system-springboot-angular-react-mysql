package com.cms.module.examination.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class StudentReportCardResponse {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Long examinationId;
    private String examinationName;
    private String academicYear;
    private Integer semester;
    private List<ResultResponse> results;
    private BigDecimal totalMarks;
    private BigDecimal obtainedMarks;
    private BigDecimal gpa;
}
