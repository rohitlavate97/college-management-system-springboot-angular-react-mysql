package com.cms.module.fee.repository;

import com.cms.module.fee.domain.entity.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {
    List<Refund> findByPaymentId(Long paymentId);
}
