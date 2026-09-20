package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.dto.AuditLogResponse;
import com.example.subsidyadmin.service.AuditLogService;
import com.example.subsidyadmin.util.PaginationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @Autowired
    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<List<AuditLogResponse>> getLogsForEntity(@PathVariable String entityType, @PathVariable Long entityId) {
        List<AuditLogResponse> logs = auditLogService.listAuditLogsForEntity(entityType, entityId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Page<AuditLogResponse>> getAllLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PaginationUtil.createPageable(page, size);
        Page<AuditLogResponse> logs = auditLogService.listAllAuditLogs(pageable);
        return ResponseEntity.ok(logs);
    }
}
