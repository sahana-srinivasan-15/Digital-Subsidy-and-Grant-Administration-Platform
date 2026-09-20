package com.example.subsidyadmin.service;

import com.example.subsidyadmin.dto.ApprovalRequest;
import com.example.subsidyadmin.dto.ApprovalResponse;
import java.util.List;

public interface ApprovalService {
    ApprovalResponse createApproval(ApprovalRequest request);
    ApprovalResponse approveApplication(ApprovalRequest request);
    ApprovalResponse rejectApplication(Long applicationId, String remarks);
    ApprovalResponse getApproval(Long approvalId);
    List<ApprovalResponse> listApprovalsByApplication(Long applicationId);
}
