package com.cms.module.fee.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class FeeInvoiceRequest {
    private Long studentId; // For single student
    private Long courseId; // For bulk generation for a course
    @NotNull(message = "Fee Structure ID is required")
    private Long feeStructureId;
    @PositiveOrZero(message = "Discount amount must be positive or zero")
    private BigDecimal discountAmount;
}
