package com.cms.module.fee.dto.response;

import com.cms.module.fee.domain.enums.InvoiceStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class FeeInvoiceResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long feeStructureId;
    private String feeStructureName;
    private String invoiceNumber;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal discountAmount;
    private InvoiceStatus status;
    private LocalDate dueDate;
    private LocalDate issuedDate;
    private LocalDateTime createdAt;
}
