package com.example.subsidyadmin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ApprovalRequest {
    @NotNull
    private Long applicationId;

    @NotBlank
    private String authorityComments;

    @NotNull
    @Positive
    private java.math.BigDecimal approvedAmount;

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public String getAuthorityComments() { return authorityComments; }
    public void setAuthorityComments(String authorityComments) { this.authorityComments = authorityComments; }
    public java.math.BigDecimal getApprovedAmount() { return approvedAmount; }
    public void setApprovedAmount(java.math.BigDecimal approvedAmount) { this.approvedAmount = approvedAmount; }
    private Long authorityId;

    private String decision = "APPROVED";

    public Long getAuthorityId() { return authorityId; }
    public void setAuthorityId(Long authorityId) { this.authorityId = authorityId; }

    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }

}
