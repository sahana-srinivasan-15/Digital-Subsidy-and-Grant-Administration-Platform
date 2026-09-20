package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.dto.ApprovalRequest;
import com.example.subsidyadmin.dto.ApprovalResponse;
import com.example.subsidyadmin.service.ApprovalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
public class ApprovalController {

    private final ApprovalService approvalService;

    @Autowired
    public ApprovalController(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @PostMapping
    public ResponseEntity<ApprovalResponse> createApproval(@Valid @RequestBody ApprovalRequest request) {
        ApprovalResponse response = approvalService.createApproval(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/approve")
    public ResponseEntity<ApprovalResponse> approveApplication(@Valid @RequestBody ApprovalRequest request) {
        ApprovalResponse response = approvalService.approveApplication(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reject/{applicationId}")
    public ResponseEntity<ApprovalResponse> rejectApplication(@PathVariable Long applicationId,
                                                             @RequestParam(required = false) String remarks) {
        ApprovalResponse response = approvalService.rejectApplication(applicationId, remarks);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApprovalResponse> getApproval(@PathVariable Long id) {
        ApprovalResponse response = approvalService.getApproval(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<ApprovalResponse>> listByApplication(@PathVariable Long applicationId) {
        List<ApprovalResponse> list = approvalService.listApprovalsByApplication(applicationId);
        return ResponseEntity.ok(list);
    }
}
