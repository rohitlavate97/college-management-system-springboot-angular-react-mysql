package com.cms.module.fee.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class StudentFeeSummaryResponse {
    private BigDecimal totalFees;
    private BigDecimal paidFees;
    private BigDecimal pendingFees;
    private List<FeeInvoiceResponse> invoices;
}
