package com.cms.module.fee.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class FeeInvoiceRequest {
    private Long studentId; // For single student
    private Long courseId; // For bulk generation for a course
    @NotNull(message = "Fee Structure ID is required")
    private Long feeStructureId;
    private BigDecimal discountAmount;
}
