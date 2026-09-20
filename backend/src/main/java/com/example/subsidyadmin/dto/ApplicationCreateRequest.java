package com.example.subsidyadmin.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class ApplicationCreateRequest {
    @NotNull
    private Long applicantId; // User ID of applicant

    @NotNull
    private Long schemeId; // Scheme to which the application belongs

    @NotNull
    @Positive
    private BigDecimal requestedAmount;

    // Additional fields such as purpose, notes can be added here

    public Long getApplicantId() { return applicantId; }
    public void setApplicantId(Long applicantId) { this.applicantId = applicantId; }
    public Long getSchemeId() { return schemeId; }
    public void setSchemeId(Long schemeId) { this.schemeId = schemeId; }
    public BigDecimal getRequestedAmount() { return requestedAmount; }
    public void setRequestedAmount(BigDecimal requestedAmount) { this.requestedAmount = requestedAmount; }
}
