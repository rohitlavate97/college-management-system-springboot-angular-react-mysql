package com.cms.module.fee.service;

import com.cms.module.fee.dto.request.FeeInvoiceRequest;
import com.cms.module.fee.dto.request.FeeStructureRequest;
import com.cms.module.fee.dto.request.PaymentRequest;
import com.cms.module.fee.dto.response.FeeInvoiceResponse;
import com.cms.module.fee.dto.response.FeeStructureResponse;
import com.cms.module.fee.dto.response.PaymentResponse;
import com.cms.module.fee.dto.response.StudentFeeSummaryResponse;
import java.util.List;

public interface FeeService {
    FeeStructureResponse createFeeStructure(FeeStructureRequest request);
    List<FeeStructureResponse> getAllFeeStructures();
    
    List<FeeInvoiceResponse> generateFeeInvoices(FeeInvoiceRequest request);
    List<FeeInvoiceResponse> getStudentInvoices(Long studentId);
    
    PaymentResponse processPayment(PaymentRequest request);
    PaymentResponse getPaymentByReceipt(String receiptNumber);
    
    StudentFeeSummaryResponse getStudentFeeSummary(Long studentId);
}
