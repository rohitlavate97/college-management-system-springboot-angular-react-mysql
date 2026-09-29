package com.cms.module.fee.repository;

import com.cms.module.fee.domain.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByFeeInvoiceId(Long feeInvoiceId);
    Optional<Payment> findByReceiptNumber(String receiptNumber);
}
