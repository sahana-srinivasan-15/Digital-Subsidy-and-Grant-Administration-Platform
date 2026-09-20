package com.example.subsidyadmin.service;

import com.example.subsidyadmin.dto.FundResponse;
import java.math.BigDecimal;

public interface FundService {
    FundResponse allocateFund(Long schemeId, BigDecimal allocatedAmount);
    FundResponse getFundBySchemeId(Long schemeId);
}
