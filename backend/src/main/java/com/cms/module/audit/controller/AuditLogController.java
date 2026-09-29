package com.cms.module.audit.controller;

import com.cms.module.audit.dto.AuditLogResponse;
import com.cms.module.audit.entity.AuditAction;
import com.cms.module.audit.service.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Audit Logs Management", description = "APIs for managing audit logs")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AuditLogController {

    private final AuditService auditService;

    @GetMapping
    @Operation(summary = "Get all audit logs")
    public ResponseEntity<Page<AuditLogResponse>> getLogs(Pageable pageable) {
        return ResponseEntity.ok(auditService.getLogs(pageable));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get audit logs by user")
    public ResponseEntity<Page<AuditLogResponse>> getLogsByUser(@PathVariable Long userId, Pageable pageable) {
        return ResponseEntity.ok(auditService.getLogsByUser(userId, pageable));
    }

    @GetMapping("/action/{action}")
    @Operation(summary = "Get audit logs by action")
    public ResponseEntity<Page<AuditLogResponse>> getLogsByAction(@PathVariable AuditAction action, Pageable pageable) {
        return ResponseEntity.ok(auditService.getLogsByAction(action, pageable));
    }
}
