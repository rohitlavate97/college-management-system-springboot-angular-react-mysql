package com.cms.module.examination.dto;

import com.cms.module.examination.enums.ResultStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ResultResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Long examSubjectId;
    private String subjectName;
    private BigDecimal marksObtained;
    private String grade;
    private BigDecimal gradePoint;
    private ResultStatus status;
    private String remarks;
    private Boolean published;
    private LocalDateTime publishedAt;
}
