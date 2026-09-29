package com.cms.module.examination.dto;

import com.cms.module.examination.enums.ExaminationStatus;
import com.cms.module.examination.enums.ExaminationType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ExaminationResponse {
    private Long id;
    private String name;
    private String academicYear;
    private Integer semester;
    private ExaminationType examType;
    private LocalDate startDate;
    private LocalDate endDate;
    private ExaminationStatus status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
