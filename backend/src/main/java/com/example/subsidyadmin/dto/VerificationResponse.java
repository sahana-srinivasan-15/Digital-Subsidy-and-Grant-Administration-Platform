package com.example.subsidyadmin.dto;

/**
 * DTO returned after a verification is performed.
 */
public class VerificationResponse {
    private Long verificationId;
    private Long applicationId;
    private Long verifierId;
    private String remarks;
    private Integer score;
    private java.time.LocalDateTime verifiedAt;

    public Long getVerificationId() { return verificationId; }
    public void setVerificationId(Long verificationId) { this.verificationId = verificationId; }

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public Long getVerifierId() { return verifierId; }
    public void setVerifierId(Long verifierId) { this.verifierId = verifierId; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public java.time.LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(java.time.LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }
}
