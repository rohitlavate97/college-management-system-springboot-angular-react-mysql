package com.cms.module.audit.dto;

import com.cms.module.audit.entity.AuditAction;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AuditLogResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private AuditAction action;
    private String entityType;
    private Long entityId;
    private String details;
    private String ipAddress;
    private String traceId;
    private LocalDateTime createdAt;
}
