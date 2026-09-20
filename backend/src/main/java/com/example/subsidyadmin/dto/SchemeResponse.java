package com.example.subsidyadmin.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SchemeResponse {
    private Long schemeId;
    private String name;
    private String description;
    private BigDecimal maximumAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime applicationDeadline;
    private String schemeName;
    private String schemeType;
    private BigDecimal totalFund;

    public String getSchemeName() { return schemeName; }
    public void setSchemeName(String schemeName) { this.schemeName = schemeName; }
    public String getSchemeType() { return schemeType; }
    public void setSchemeType(String schemeType) { this.schemeType = schemeType; }
    public BigDecimal getTotalFund() { return totalFund; }
    public void setTotalFund(BigDecimal totalFund) { this.totalFund = totalFund; }

    // Getters and Setters
    public Long getSchemeId() { return schemeId; }
    public void setSchemeId(Long schemeId) { this.schemeId = schemeId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getMaximumAmount() { return maximumAmount; }
    public void setMaximumAmount(BigDecimal maximumAmount) { this.maximumAmount = maximumAmount; }
    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
    public LocalDateTime getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDateTime applicationDeadline) { this.applicationDeadline = applicationDeadline; }
    private String status;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
