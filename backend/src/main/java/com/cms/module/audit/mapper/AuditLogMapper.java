package com.cms.module.audit.mapper;

import com.cms.module.audit.dto.AuditLogResponse;
import com.cms.module.audit.entity.AuditLog;
import org.springframework.stereotype.Component;

@Component
public class AuditLogMapper {

    public AuditLogResponse toResponse(AuditLog log) {
        if (log == null) return null;
        AuditLogResponse response = new AuditLogResponse();
        response.setId(log.getId());
        if (log.getUser() != null) {
            response.setUserId(log.getUser().getId());
            response.setUserEmail(log.getUser().getEmail());
        }
        response.setAction(log.getAction());
        response.setEntityType(log.getEntityType());
        response.setEntityId(log.getEntityId());
        response.setDetails(log.getDetails());
        response.setIpAddress(log.getIpAddress());
        response.setTraceId(log.getTraceId());
        response.setCreatedAt(log.getCreatedAt());
        return response;
    }
}
