package com.cms.module.audit.service;

import com.cms.module.audit.entity.AuditAction;
import com.cms.module.audit.dto.AuditLogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditService {
    void logAction(Long userId, AuditAction action, String entityType, Long entityId, String details);
    Page<AuditLogResponse> getLogs(Pageable pageable);
    Page<AuditLogResponse> getLogsByUser(Long userId, Pageable pageable);
    Page<AuditLogResponse> getLogsByAction(AuditAction action, Pageable pageable);
}
