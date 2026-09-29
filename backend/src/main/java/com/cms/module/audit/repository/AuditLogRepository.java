package com.cms.module.audit.repository;

import com.cms.module.audit.entity.AuditAction;
import com.cms.module.audit.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    Page<AuditLog> findByUserId(Long userId, Pageable pageable);
    Page<AuditLog> findByAction(AuditAction action, Pageable pageable);
    List<AuditLog> findByEntityTypeAndEntityId(String entityType, Long entityId);
}
