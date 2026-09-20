package com.example.subsidyadmin.service;

import com.example.subsidyadmin.dto.AuditLogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface AuditLogService {
    AuditLogResponse recordAudit(String entityType, Long entityId, String action, Long userId, String details);
    List<AuditLogResponse> listAuditLogsForEntity(String entityType, Long entityId);
    Page<AuditLogResponse> listAllAuditLogs(Pageable pageable);
}
