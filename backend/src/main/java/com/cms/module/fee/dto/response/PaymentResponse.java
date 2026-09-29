package com.cms.module.fee.dto.response;

import com.cms.module.fee.domain.enums.PaymentStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentResponse {
    private Long id;
    private Long feeInvoiceId;
    private String invoiceNumber;
    private BigDecimal amount;
    private String paymentMethod;
    private LocalDateTime paymentDate;
    private String transactionReference;
    private PaymentStatus status;
    private String receiptNumber;
    private String remarks;
}
