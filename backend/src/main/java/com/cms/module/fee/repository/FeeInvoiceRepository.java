package com.cms.module.fee.repository;

import com.cms.module.fee.domain.entity.FeeInvoice;
import com.cms.module.fee.domain.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FeeInvoiceRepository extends JpaRepository<FeeInvoice, Long> {
    List<FeeInvoice> findByStudentId(Long studentId);
    List<FeeInvoice> findByStatus(InvoiceStatus status);
    Optional<FeeInvoice> findByInvoiceNumber(String invoiceNumber);
}
