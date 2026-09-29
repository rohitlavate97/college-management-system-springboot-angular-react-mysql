package com.cms.module.fee.dto.response;

import com.cms.module.fee.domain.enums.FeeType;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class FeeStructureResponse {
    private Long id;
    private Long courseId;
    private String courseName;
    private String name;
    private String academicYear;
    private Integer semester;
    private FeeType feeType;
    private BigDecimal amount;
    private LocalDate dueDate;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
