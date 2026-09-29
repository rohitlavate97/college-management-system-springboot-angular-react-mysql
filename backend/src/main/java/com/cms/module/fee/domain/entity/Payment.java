package com.cms.module.fee.domain.entity;

import com.cms.common.BaseEntity;
import com.cms.module.fee.domain.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
public class Payment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fee_invoice_id", nullable = false)
    private FeeInvoice feeInvoice;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate;

    @Column(name = "transaction_reference", unique = true)
    private String transactionReference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(name = "receipt_number", unique = true)
    private String receiptNumber;

    private String remarks;
}
