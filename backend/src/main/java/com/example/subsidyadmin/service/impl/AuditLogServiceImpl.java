package com.example.subsidyadmin.service.impl;

import com.example.subsidyadmin.dto.AuditLogResponse;
import com.example.subsidyadmin.exception.ResourceNotFoundException;
import com.example.subsidyadmin.model.AuditLog;
import com.example.subsidyadmin.model.User;
import com.example.subsidyadmin.repository.AuditLogRepository;
import com.example.subsidyadmin.repository.UserRepository;
import com.example.subsidyadmin.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Autowired
    public AuditLogServiceImpl(AuditLogRepository auditLogRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public AuditLogResponse recordAudit(String entityType, Long entityId, String action, Long userId, String details) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        AuditLog log = new AuditLog();
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setAction(action);
        log.setPerformedBy(user);
        log.setPerformedAt(LocalDateTime.now());
        log.setDetails(details);
        log.setCreatedAt(LocalDateTime.now());

        AuditLog saved = auditLogRepository.save(log);
        return toResponse(saved);
    }

    @Override
    public List<AuditLogResponse> listAuditLogsForEntity(String entityType, Long entityId) {
        List<AuditLog> logs = auditLogRepository.findByEntityTypeAndEntityId(entityType, entityId);
        return logs.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public Page<AuditLogResponse> listAllAuditLogs(Pageable pageable) {
        Page<AuditLog> page = auditLogRepository.findAll(pageable);
        List<AuditLogResponse> content = page.getContent().stream().map(this::toResponse).collect(Collectors.toList());
        return new PageImpl<>(content, pageable, page.getTotalElements());
    }

    private AuditLogResponse toResponse(AuditLog log) {
        AuditLogResponse resp = new AuditLogResponse();
        resp.setLogId(log.getLogId());
        resp.setEntityType(log.getEntityType());
        resp.setEntityId(log.getEntityId());
        resp.setAction(log.getAction());
        resp.setPerformedBy(log.getPerformedBy().getUserId());
        resp.setPerformedAt(log.getPerformedAt());
        resp.setDetails(log.getDetails());
        resp.setCreatedAt(log.getCreatedAt());
        return resp;
    }
}
