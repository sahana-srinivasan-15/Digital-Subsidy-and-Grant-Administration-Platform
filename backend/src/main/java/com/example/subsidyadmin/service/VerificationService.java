package com.example.subsidyadmin.service;

import com.example.subsidyadmin.dto.VerificationRequest;
import com.example.subsidyadmin.dto.VerificationResponse;
import java.util.List;

public interface VerificationService {
    /**
     * Record a verification for an application.
     */
    VerificationResponse verifyApplication(VerificationRequest request);

    VerificationResponse getVerification(Long verificationId);

    List<VerificationResponse> listVerificationsByApplication(Long applicationId);
}
