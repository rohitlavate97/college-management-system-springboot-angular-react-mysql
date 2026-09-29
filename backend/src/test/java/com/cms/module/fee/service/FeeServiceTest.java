package com.cms.module.fee.service;

import com.cms.module.course.entity.Course;
import com.cms.module.fee.domain.entity.FeeInvoice;
import com.cms.module.fee.domain.entity.FeeStructure;
import com.cms.module.fee.domain.entity.Payment;
import com.cms.module.fee.domain.enums.InvoiceStatus;
import com.cms.module.fee.domain.enums.PaymentStatus;
import com.cms.module.fee.dto.request.FeeInvoiceRequest;
import com.cms.module.fee.dto.request.PaymentRequest;
import com.cms.module.fee.dto.response.FeeInvoiceResponse;
import com.cms.module.fee.dto.response.PaymentResponse;
import com.cms.module.fee.mapper.FeeInvoiceMapper;
import com.cms.module.fee.mapper.PaymentMapper;
import com.cms.module.fee.repository.FeeInvoiceRepository;
import com.cms.module.fee.repository.FeeStructureRepository;
import com.cms.module.fee.repository.PaymentRepository;
import com.cms.module.fee.service.impl.FeeServiceImpl;
import com.cms.module.student.entity.Student;
import com.cms.module.student.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeeServiceTest {

    @Mock
    private FeeStructureRepository feeStructureRepository;
    @Mock
    private FeeInvoiceRepository feeInvoiceRepository;
    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private StudentRepository studentRepository;
    @Mock
    private FeeInvoiceMapper feeInvoiceMapper;
    @Mock
    private PaymentMapper paymentMapper;

    @InjectMocks
    private FeeServiceImpl feeService;

    private FeeStructure feeStructure;
    private Student student;
    private FeeInvoice invoice;

    @BeforeEach
    void setUp() {
        feeStructure = new FeeStructure();
        feeStructure.setId(1L);
        feeStructure.setAmount(new BigDecimal("50000.00"));

        student = new Student();
        student.setId(1L);

        invoice = new FeeInvoice();
        invoice.setId(1L);
        invoice.setTotalAmount(new BigDecimal("50000.00"));
        invoice.setDiscountAmount(BigDecimal.ZERO);
        invoice.setPaidAmount(BigDecimal.ZERO);
        invoice.setStatus(InvoiceStatus.PENDING);
    }

    @Test
    void generateFeeInvoices_Success() {
        FeeInvoiceRequest request = new FeeInvoiceRequest();
        request.setFeeStructureId(1L);
        request.setStudentId(1L);

        when(feeStructureRepository.findById(1L)).thenReturn(Optional.of(feeStructure));
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(feeInvoiceRepository.save(any(FeeInvoice.class))).thenReturn(invoice);
        
        FeeInvoiceResponse response = new FeeInvoiceResponse();
        response.setId(1L);
        when(feeInvoiceMapper.toResponse(any(FeeInvoice.class))).thenReturn(response);

        List<FeeInvoiceResponse> result = feeService.generateFeeInvoices(request);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(feeInvoiceRepository).save(any(FeeInvoice.class));
    }

    @Test
    void processPayment_FullPayment_Success() {
        PaymentRequest request = new PaymentRequest();
        request.setInvoiceId(1L);
        request.setAmount(new BigDecimal("50000.00"));

        when(feeInvoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));
        
        Payment savedPayment = new Payment();
        savedPayment.setId(1L);
        savedPayment.setAmount(new BigDecimal("50000.00"));
        savedPayment.setStatus(PaymentStatus.COMPLETED);
        
        when(paymentRepository.save(any(Payment.class))).thenReturn(savedPayment);
        
        PaymentResponse response = new PaymentResponse();
        response.setId(1L);
        response.setStatus(PaymentStatus.COMPLETED);
        when(paymentMapper.toResponse(any(Payment.class))).thenReturn(response);

        PaymentResponse result = feeService.processPayment(request);

        assertNotNull(result);
        assertEquals(InvoiceStatus.PAID, invoice.getStatus());
        assertEquals(new BigDecimal("50000.00"), invoice.getPaidAmount());
        verify(paymentRepository).save(any(Payment.class));
        verify(feeInvoiceRepository).save(invoice);
    }

    @Test
    void processPayment_PartialPayment_Success() {
        PaymentRequest request = new PaymentRequest();
        request.setInvoiceId(1L);
        request.setAmount(new BigDecimal("25000.00"));

        when(feeInvoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));
        when(paymentRepository.save(any(Payment.class))).thenReturn(new Payment());
        when(paymentMapper.toResponse(any())).thenReturn(new PaymentResponse());

        feeService.processPayment(request);

        assertEquals(InvoiceStatus.PARTIALLY_PAID, invoice.getStatus());
        assertEquals(new BigDecimal("25000.00"), invoice.getPaidAmount());
        verify(feeInvoiceRepository).save(invoice);
    }

    @Test
    void processPayment_Overpayment_ThrowsException() {
        PaymentRequest request = new PaymentRequest();
        request.setInvoiceId(1L);
        request.setAmount(new BigDecimal("60000.00"));

        when(feeInvoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> feeService.processPayment(request));
        assertEquals("Payment amount exceeds remaining balance", exception.getMessage());
        verify(paymentRepository, never()).save(any(Payment.class));
    }
}
