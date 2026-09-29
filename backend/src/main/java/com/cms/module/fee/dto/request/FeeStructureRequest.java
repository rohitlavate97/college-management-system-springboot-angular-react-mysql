package com.cms.module.fee.dto.request;

import com.cms.module.fee.domain.enums.FeeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FeeStructureRequest {
    @NotNull(message = "Course ID is required")
    private Long courseId;
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Academic year is required")
    private String academicYear;
    private Integer semester;
    @NotNull(message = "Fee type is required")
    private FeeType feeType;
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    private LocalDate dueDate;
    private Boolean isActive;
}
