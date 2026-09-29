package com.cms.security;

import com.cms.module.fee.repository.FeeInvoiceRepository;
import com.cms.module.fee.repository.PaymentRepository;
import com.cms.module.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("securityService")
@RequiredArgsConstructor
public class SecurityService {

    private final StudentRepository studentRepository;
    private final FeeInvoiceRepository feeInvoiceRepository;
    private final PaymentRepository paymentRepository;

    public boolean isOwner(Long userId) {
        if (userId == null) {
            return false;
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        // Admins can bypass ownership checks
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            return true;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails userDetails) {
            return userId.equals(userDetails.getId());
        }

        return false;
    }

    public boolean isStudentOwner(Long studentId) {
        if (studentId == null) {
            return false;
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        boolean isStaffOrAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN")
                        || a.getAuthority().equals("ROLE_ADMIN")
                        || a.getAuthority().equals("ROLE_HOD")
                        || a.getAuthority().equals("ROLE_PROFESSOR")
                        || a.getAuthority().equals("ROLE_ACCOUNTANT"));
        if (isStaffOrAdmin) {
            return true;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails userDetails) {
            return studentRepository.findById(studentId)
                    .map(student -> student.getUser() != null && userDetails.getId().equals(student.getUser().getId()))
                    .orElse(false);
        }

        return false;
    }

    public boolean isInvoiceOwner(Long invoiceId) {
        if (invoiceId == null) {
            return false;
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        boolean isStaffOrAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN")
                        || a.getAuthority().equals("ROLE_ADMIN")
                        || a.getAuthority().equals("ROLE_ACCOUNTANT"));
        if (isStaffOrAdmin) {
            return true;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails userDetails) {
            return feeInvoiceRepository.findById(invoiceId)
                    .map(inv -> inv.getStudent() != null
                            && inv.getStudent().getUser() != null
                            && userDetails.getId().equals(inv.getStudent().getUser().getId()))
                    .orElse(false);
        }

        return false;
    }

    public boolean isPaymentOwner(String receiptNumber) {
        if (receiptNumber == null || receiptNumber.isBlank()) {
            return false;
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        boolean isStaffOrAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN")
                        || a.getAuthority().equals("ROLE_ADMIN")
                        || a.getAuthority().equals("ROLE_ACCOUNTANT"));
        if (isStaffOrAdmin) {
            return true;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails userDetails) {
            return paymentRepository.findByReceiptNumber(receiptNumber)
                    .map(p -> p.getFeeInvoice() != null
                            && p.getFeeInvoice().getStudent() != null
                            && p.getFeeInvoice().getStudent().getUser() != null
                            && userDetails.getId().equals(p.getFeeInvoice().getStudent().getUser().getId()))
                    .orElse(false);
        }

        return false;
    }
}
