package com.example.subsidyadmin.dto;

import java.math.BigDecimal;

public class FundResponse {
    private Long fundId;
    private Long schemeId;
    private BigDecimal totalAllocatedAmount;
    private BigDecimal totalDistributedAmount;
    private BigDecimal availableAmount;

    public Long getFundId() { return fundId; }
    public void setFundId(Long fundId) { this.fundId = fundId; }
    public Long getSchemeId() { return schemeId; }
    public void setSchemeId(Long schemeId) { this.schemeId = schemeId; }
    public BigDecimal getTotalAllocatedAmount() { return totalAllocatedAmount; }
    public void setTotalAllocatedAmount(BigDecimal totalAllocatedAmount) { this.totalAllocatedAmount = totalAllocatedAmount; }
    public BigDecimal getTotalDistributedAmount() { return totalDistributedAmount; }
    public void setTotalDistributedAmount(BigDecimal totalDistributedAmount) { this.totalDistributedAmount = totalDistributedAmount; }
    public BigDecimal getAvailableAmount() { return availableAmount; }
    public void setAvailableAmount(BigDecimal availableAmount) { this.availableAmount = availableAmount; }
}
