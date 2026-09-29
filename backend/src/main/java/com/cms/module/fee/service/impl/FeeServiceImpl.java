package com.cms.module.fee.service.impl;

import com.cms.module.course.entity.Course;
import com.cms.module.course.repository.CourseRepository;
import com.cms.module.fee.domain.entity.FeeInvoice;
import com.cms.module.fee.domain.entity.FeeStructure;
import com.cms.module.fee.domain.entity.Payment;
import com.cms.module.fee.domain.enums.InvoiceStatus;
import com.cms.module.fee.domain.enums.PaymentStatus;
import com.cms.module.fee.dto.request.FeeInvoiceRequest;
import com.cms.module.fee.dto.request.FeeStructureRequest;
import com.cms.module.fee.dto.request.PaymentRequest;
import com.cms.module.fee.dto.response.FeeInvoiceResponse;
import com.cms.module.fee.dto.response.FeeStructureResponse;
import com.cms.module.fee.dto.response.PaymentResponse;
import com.cms.module.fee.dto.response.StudentFeeSummaryResponse;
import com.cms.module.fee.mapper.FeeInvoiceMapper;
import com.cms.module.fee.mapper.FeeStructureMapper;
import com.cms.module.fee.mapper.PaymentMapper;
import com.cms.module.fee.repository.FeeInvoiceRepository;
import com.cms.module.fee.repository.FeeStructureRepository;
import com.cms.module.fee.repository.PaymentRepository;
import com.cms.module.fee.service.FeeService;
import com.cms.module.student.entity.Student;
import com.cms.module.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeeServiceImpl implements FeeService {

    private final FeeStructureRepository feeStructureRepository;
    private final FeeInvoiceRepository feeInvoiceRepository;
    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    
    private final FeeStructureMapper feeStructureMapper;
    private final FeeInvoiceMapper feeInvoiceMapper;
    private final PaymentMapper paymentMapper;

    @Override
    @Transactional
    public FeeStructureResponse createFeeStructure(FeeStructureRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        FeeStructure feeStructure = feeStructureMapper.toEntity(request);
        feeStructure.setCourse(course);
        feeStructure = feeStructureRepository.save(feeStructure);
        return feeStructureMapper.toResponse(feeStructure);
    }

    @Override
    public List<FeeStructureResponse> getAllFeeStructures() {
        return feeStructureRepository.findAll().stream()
                .map(feeStructureMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<FeeInvoiceResponse> generateFeeInvoices(FeeInvoiceRequest request) {
        FeeStructure feeStructure = feeStructureRepository.findById(request.getFeeStructureId())
                .orElseThrow(() -> new RuntimeException("Fee structure not found"));
        
        List<Student> students = new ArrayList<>();
        if (request.getStudentId() != null) {
            students.add(studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found")));
        } else if (request.getCourseId() != null) {
            students.addAll(studentRepository.findAllByCourseId(request.getCourseId()));
        } else {
            throw new RuntimeException("Must specify studentId or courseId");
        }
        
        List<FeeInvoice> invoices = new ArrayList<>();
        for (Student student : students) {
            FeeInvoice invoice = new FeeInvoice();
            invoice.setStudent(student);
            invoice.setFeeStructure(feeStructure);
            invoice.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            invoice.setTotalAmount(feeStructure.getAmount());
            if (request.getDiscountAmount() != null) {
                invoice.setDiscountAmount(request.getDiscountAmount());
            }
            invoice.setDueDate(feeStructure.getDueDate() != null ? feeStructure.getDueDate() : LocalDate.now().plusDays(30));
            invoice.setIssuedDate(LocalDate.now());
            invoice.setStatus(InvoiceStatus.PENDING);
            invoices.add(feeInvoiceRepository.save(invoice));
        }
        
        return invoices.stream().map(feeInvoiceMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<FeeInvoiceResponse> getStudentInvoices(Long studentId) {
        return feeInvoiceRepository.findByStudentId(studentId).stream()
                .map(feeInvoiceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        FeeInvoice invoice = feeInvoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        
        BigDecimal payableAmount = invoice.getTotalAmount().subtract(invoice.getDiscountAmount());
        BigDecimal remainingAmount = payableAmount.subtract(invoice.getPaidAmount());
        
        if (request.getAmount().compareTo(remainingAmount) > 0) {
            throw new RuntimeException("Payment amount exceeds remaining balance");
        }
        
        Payment payment = new Payment();
        payment.setFeeInvoice(invoice);
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setTransactionReference("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setReceiptNumber("RCPT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setRemarks(request.getRemarks());
        
        payment = paymentRepository.save(payment);
        
        invoice.setPaidAmount(invoice.getPaidAmount().add(request.getAmount()));
        if (invoice.getPaidAmount().compareTo(payableAmount) >= 0) {
            invoice.setStatus(InvoiceStatus.PAID);
        } else {
            invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);
        }
        feeInvoiceRepository.save(invoice);
        
        return paymentMapper.toResponse(payment);
    }

    @Override
    public PaymentResponse getPaymentByReceipt(String receiptNumber) {
        Payment payment = paymentRepository.findByReceiptNumber(receiptNumber)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return paymentMapper.toResponse(payment);
    }

    @Override
    public StudentFeeSummaryResponse getStudentFeeSummary(Long studentId) {
        List<FeeInvoice> invoices = feeInvoiceRepository.findByStudentId(studentId);
        BigDecimal totalFees = BigDecimal.ZERO;
        BigDecimal paidFees = BigDecimal.ZERO;
        
        for (FeeInvoice invoice : invoices) {
            totalFees = totalFees.add(invoice.getTotalAmount().subtract(invoice.getDiscountAmount()));
            paidFees = paidFees.add(invoice.getPaidAmount());
        }
        
        StudentFeeSummaryResponse summary = new StudentFeeSummaryResponse();
        summary.setTotalFees(totalFees);
        summary.setPaidFees(paidFees);
        summary.setPendingFees(totalFees.subtract(paidFees));
        summary.setInvoices(invoices.stream().map(feeInvoiceMapper::toResponse).collect(Collectors.toList()));
        return summary;
    }
}

