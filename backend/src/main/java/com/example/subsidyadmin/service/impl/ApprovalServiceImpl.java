package com.example.subsidyadmin.service.impl;

import com.example.subsidyadmin.dto.ApprovalRequest;
import com.example.subsidyadmin.dto.ApprovalResponse;
import com.example.subsidyadmin.exception.BusinessException;
import com.example.subsidyadmin.exception.ResourceNotFoundException;
import com.example.subsidyadmin.model.Application;
import com.example.subsidyadmin.model.Approval;
import com.example.subsidyadmin.model.User;
import com.example.subsidyadmin.repository.ApplicationRepository;
import com.example.subsidyadmin.repository.ApprovalRepository;
import com.example.subsidyadmin.repository.UserRepository;
import com.example.subsidyadmin.service.ApprovalService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApprovalServiceImpl implements ApprovalService {

    private final ApprovalRepository approvalRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    @Autowired
    public ApprovalServiceImpl(
            ApprovalRepository approvalRepository,
            ApplicationRepository applicationRepository,
            UserRepository userRepository) {

        this.approvalRepository = approvalRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    /**
     * Create an approval record.
     *
     * This method is required because ApprovalService declares
     * createApproval().
     */
    @Override
    @Transactional
    public ApprovalResponse createApproval(ApprovalRequest request) {

        if (request == null) {
            throw new BusinessException("Approval request cannot be null");
        }

        if (request.getApplicationId() == null) {
            throw new BusinessException("Application ID is required");
        }

        // Find application
        Application application = applicationRepository
                .findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id "
                                + request.getApplicationId()));

        // Resolve authority user
        Long authId = (request.getAuthorityId() != null) ? request.getAuthorityId() : 3L;
        User authority = userRepository.findById(authId)
                .orElseGet(() -> userRepository.findAll().stream()
                        .filter(u -> u.getRole() != null && "AUTHORITY".equalsIgnoreCase(u.getRole().getRoleName()))
                        .findFirst()
                        .orElseGet(() -> userRepository.findById(1L).orElse(null)));

        // Create approval record
        Approval approval = new Approval();

        approval.setApplication(application);
        approval.setAuthority(authority);

        // Default decision
        approval.setDecision("PENDING");

        // No approved amount yet
        approval.setApprovedAmount(BigDecimal.ZERO);

        approval.setRemarks(request.getAuthorityComments());

        approval.setDecisionDate(LocalDateTime.now());
        approval.setCreatedAt(LocalDateTime.now());

        Approval savedApproval =
                approvalRepository.save(approval);

        return toResponse(savedApproval);
    }

    /**
     * Approve an application.
     */
    @Override
    @Transactional
    public ApprovalResponse approveApplication(
            ApprovalRequest request) {

        if (request == null) {
            throw new BusinessException(
                    "Approval request cannot be null");
        }

        if (request.getApplicationId() == null) {
            throw new BusinessException(
                    "Application ID is required");
        }

        if (request.getApprovedAmount() == null) {
            throw new BusinessException(
                    "Approved amount is required");
        }

        if (request.getApprovedAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(
                    "Approved amount must be greater than zero");
        }

        // Find application
        Application application = applicationRepository
                .findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id "
                                + request.getApplicationId()));

        // Check scheme
        if (application.getScheme() == null) {
            throw new BusinessException(
                    "Scheme is not associated with this application");
        }

        BigDecimal approvedAmount = request.getApprovedAmount();

        // Validate scheme maximum amount
        BigDecimal maximumAmount =
                application.getScheme().getMaximumAmount();

        if (maximumAmount != null
                && approvedAmount.compareTo(maximumAmount) > 0) {

            throw new BusinessException(
                    "Approved amount cannot exceed scheme maximum limit of "
                            + maximumAmount);
        }

        // Validate requested amount
        if (application.getRequestedAmount() != null
                && approvedAmount.compareTo(
                        application.getRequestedAmount()) > 0) {

            throw new BusinessException(
                    "Approved amount cannot exceed requested amount");
        }

        // Prevent approving rejected application
        if ("REJECTED".equalsIgnoreCase(
                application.getApplicationStatus())) {

            throw new BusinessException(
                    "A rejected application cannot be approved");
        }

        // Prevent duplicate approval
        if ("APPROVED".equalsIgnoreCase(
                application.getApplicationStatus())) {

            throw new BusinessException(
                    "Application is already approved");
        }

        // Resolve authority user
        Long authId = (request.getAuthorityId() != null) ? request.getAuthorityId() : 3L;
        User authority = userRepository.findById(authId)
                .orElseGet(() -> userRepository.findAll().stream()
                        .filter(u -> u.getRole() != null && "AUTHORITY".equalsIgnoreCase(u.getRole().getRoleName()))
                        .findFirst()
                        .orElseGet(() -> userRepository.findById(1L).orElse(null)));

        // Create approval record
        Approval approval = new Approval();

        approval.setApplication(application);
        approval.setAuthority(authority);
        approval.setDecision("APPROVED");
        approval.setApprovedAmount(approvedAmount);
        approval.setRemarks(request.getAuthorityComments());
        approval.setDecisionDate(LocalDateTime.now());
        approval.setCreatedAt(LocalDateTime.now());

        // Save approval
        Approval savedApproval =
                approvalRepository.save(approval);

        // Update application status
        application.setApplicationStatus("APPROVED");

        applicationRepository.save(application);

        return toResponse(savedApproval);
    }

    /**
     * Reject an application.
     */
    @Override
    @Transactional
    public ApprovalResponse rejectApplication(
            Long applicationId,
            String remarks) {

        if (applicationId == null) {
            throw new BusinessException(
                    "Application ID is required");
        }

        Application application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id "
                                + applicationId));

        // Prevent rejecting already rejected application
        if ("REJECTED".equalsIgnoreCase(
                application.getApplicationStatus())) {

            throw new BusinessException(
                    "Application is already rejected");
        }

        // Prevent rejecting paid application
        if ("PAID".equalsIgnoreCase(
                application.getApplicationStatus())) {

            throw new BusinessException(
                    "A paid application cannot be rejected");
        }

        // Resolve authority user
        User authority = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && "AUTHORITY".equalsIgnoreCase(u.getRole().getRoleName()))
                .findFirst()
                .orElseGet(() -> userRepository.findById(1L).orElse(null));

        // Create rejection record
        Approval approval = new Approval();

        approval.setApplication(application);
        approval.setAuthority(authority);
        approval.setDecision("REJECTED");
        approval.setApprovedAmount(BigDecimal.ZERO);
        approval.setRemarks(remarks);
        approval.setDecisionDate(LocalDateTime.now());
        approval.setCreatedAt(LocalDateTime.now());

        // Save approval
        Approval savedApproval =
                approvalRepository.save(approval);

        // Update application status
        application.setApplicationStatus("REJECTED");

        applicationRepository.save(application);

        return toResponse(savedApproval);
    }

    /**
     * Get approval by approval ID.
     */
    @Override
    public ApprovalResponse getApproval(Long approvalId) {

        if (approvalId == null) {
            throw new BusinessException(
                    "Approval ID is required");
        }

        Approval approval = approvalRepository
                .findById(approvalId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Approval not found with id "
                                + approvalId));

        return toResponse(approval);
    }

    @Override
    public List<ApprovalResponse> listApprovalsByApplication(
            Long applicationId) {

        if (applicationId == null) {
            throw new BusinessException(
                    "Application ID is required");
        }

        // Make sure application exists
        applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id "
                                + applicationId));

        List<Approval> approvals =
                approvalRepository
                        .findByApplicationApplicationId(applicationId);

        return approvals.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convert Approval entity to ApprovalResponse.
     */
    private ApprovalResponse toResponse(
            Approval approval) {

        ApprovalResponse response =
                new ApprovalResponse();

        response.setApprovalId(
                approval.getApprovalId());

        response.setApplicationId(
                approval.getApplication()
                        .getApplicationId());

        response.setAuthorityId(
                approval.getAuthority()
                        .getUserId());

        response.setStatus(
                approval.getDecision());

        response.setApprovedAmount(
                approval.getApprovedAmount());

        response.setRemarks(
                approval.getRemarks());

        response.setApprovedAt(
                approval.getDecisionDate());

        return response;
    }
}
