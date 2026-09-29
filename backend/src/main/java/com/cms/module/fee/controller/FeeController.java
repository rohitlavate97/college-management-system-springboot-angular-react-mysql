package com.cms.module.fee.controller;

import com.cms.module.fee.dto.request.FeeInvoiceRequest;
import com.cms.module.fee.dto.request.FeeStructureRequest;
import com.cms.module.fee.dto.request.PaymentRequest;
import com.cms.module.fee.dto.response.FeeInvoiceResponse;
import com.cms.module.fee.dto.response.FeeStructureResponse;
import com.cms.module.fee.dto.response.PaymentResponse;
import com.cms.module.fee.dto.response.StudentFeeSummaryResponse;
import com.cms.module.fee.service.FeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/fees")
@RequiredArgsConstructor
@Tag(name = "Fee Management", description = "Endpoints for managing fee structures, invoices, and payments")
public class FeeController {

    private final FeeService feeService;

    @PostMapping("/structures")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT')")
    @Operation(summary = "Create a new fee structure")
    public ResponseEntity<FeeStructureResponse> createFeeStructure(@Valid @RequestBody FeeStructureRequest request) {
        return new ResponseEntity<>(feeService.createFeeStructure(request), HttpStatus.CREATED);
    }

    @GetMapping("/structures")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT', 'HOD')")
    @Operation(summary = "Get all fee structures")
    public ResponseEntity<List<FeeStructureResponse>> getAllFeeStructures() {
        return ResponseEntity.ok(feeService.getAllFeeStructures());
    }

    @PostMapping("/invoices")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT')")
    @Operation(summary = "Generate fee invoices")
    public ResponseEntity<List<FeeInvoiceResponse>> generateFeeInvoices(@Valid @RequestBody FeeInvoiceRequest request) {
        return new ResponseEntity<>(feeService.generateFeeInvoices(request), HttpStatus.CREATED);
    }

    @GetMapping("/invoices/student/{studentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT') or (hasRole('STUDENT') and @securityService.isStudentOwner(#studentId))")
    @Operation(summary = "Get all fee invoices for a student")
    public ResponseEntity<List<FeeInvoiceResponse>> getStudentInvoices(@PathVariable Long studentId) {
        return ResponseEntity.ok(feeService.getStudentInvoices(studentId));
    }

    @PostMapping("/payments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT') or (hasRole('STUDENT') and @securityService.isInvoiceOwner(#request.invoiceId))")
    @Operation(summary = "Process a payment")
    public ResponseEntity<PaymentResponse> processPayment(@Valid @RequestBody PaymentRequest request) {
        return new ResponseEntity<>(feeService.processPayment(request), HttpStatus.CREATED);
    }

    @GetMapping("/payments/receipt/{receiptNumber}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT') or (hasRole('STUDENT') and @securityService.isPaymentOwner(#receiptNumber))")
    @Operation(summary = "Get payment by receipt number")
    public ResponseEntity<PaymentResponse> getPaymentByReceipt(@PathVariable String receiptNumber) {
        return ResponseEntity.ok(feeService.getPaymentByReceipt(receiptNumber));
    }

    @GetMapping("/student/{studentId}/summary")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT') or (hasRole('STUDENT') and @securityService.isStudentOwner(#studentId))")
    @Operation(summary = "Get fee summary for a student")
    public ResponseEntity<StudentFeeSummaryResponse> getStudentFeeSummary(@PathVariable Long studentId) {
        return ResponseEntity.ok(feeService.getStudentFeeSummary(studentId));
    }
}
