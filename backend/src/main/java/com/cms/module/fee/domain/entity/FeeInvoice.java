package com.cms.module.fee.domain.entity;

import com.cms.common.BaseEntity;
import com.cms.module.student.entity.Student;
import com.cms.module.fee.domain.enums.InvoiceStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fee_invoices")
@Getter
@Setter
public class FeeInvoice extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fee_structure_id", nullable = false)
    private FeeStructure feeStructure;

    @Column(name = "invoice_number", nullable = false, unique = true)
    private String invoiceNumber;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "paid_amount", nullable = false)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "discount_amount")
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceStatus status = InvoiceStatus.PENDING;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "issued_date", nullable = false)
    private LocalDate issuedDate;
}
