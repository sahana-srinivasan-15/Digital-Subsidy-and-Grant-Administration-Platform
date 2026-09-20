package com.example.subsidyadmin.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "funds")
public class Fund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fund_id")
    private Long fundId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    @Column(name = "total_allocated_amount", precision = 15, scale = 2)
    private BigDecimal totalAllocatedAmount;

    @Column(name = "total_distributed_amount", precision = 15, scale = 2)
    private BigDecimal totalDistributedAmount;

    // Computed in DB, but we keep for convenience
    @Transient
    private BigDecimal availableAmount;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // Getters and Setters
    public Long getFundId() { return fundId; }
    public void setFundId(Long fundId) { this.fundId = fundId; }
    public Scheme getScheme() { return scheme; }
    public void setScheme(Scheme scheme) { this.scheme = scheme; }
    public BigDecimal getTotalAllocatedAmount() { return totalAllocatedAmount; }
    public void setTotalAllocatedAmount(BigDecimal totalAllocatedAmount) { this.totalAllocatedAmount = totalAllocatedAmount; }
    public BigDecimal getTotalDistributedAmount() { return totalDistributedAmount; }
    public void setTotalDistributedAmount(BigDecimal totalDistributedAmount) { this.totalDistributedAmount = totalDistributedAmount; }
    public BigDecimal getAvailableAmount() {
        if (totalAllocatedAmount != null && totalDistributedAmount != null) {
            return totalAllocatedAmount.subtract(totalDistributedAmount);
        }
        return null;
    }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
