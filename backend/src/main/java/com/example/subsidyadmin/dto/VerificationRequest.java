package com.example.subsidyadmin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class VerificationRequest {
    @NotNull
    private Long applicationId;

    @NotBlank
    private String verifierComments;

    @NotNull
    @PositiveOrZero
    private Double verificationScore; // e.g., 0.0 - 100.0

    private Long verifierId;
    private String verificationStatus;

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public String getVerifierComments() { return verifierComments; }
    public void setVerifierComments(String verifierComments) { this.verifierComments = verifierComments; }
    public Double getVerificationScore() { return verificationScore; }
    public void setVerificationScore(Double verificationScore) { this.verificationScore = verificationScore; }
    public Long getVerifierId() { return verifierId; }
    public void setVerifierId(Long verifierId) { this.verifierId = verifierId; }
    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
}
