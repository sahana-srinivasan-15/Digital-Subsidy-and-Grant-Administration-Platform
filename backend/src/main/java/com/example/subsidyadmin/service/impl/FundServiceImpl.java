package com.example.subsidyadmin.service.impl;

import com.example.subsidyadmin.dto.FundResponse;
import com.example.subsidyadmin.exception.ResourceNotFoundException;
import com.example.subsidyadmin.model.Fund;
import com.example.subsidyadmin.model.Scheme;
import com.example.subsidyadmin.repository.FundRepository;
import com.example.subsidyadmin.repository.SchemeRepository;
import com.example.subsidyadmin.service.FundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class FundServiceImpl implements FundService {

    private final FundRepository fundRepository;
    private final SchemeRepository schemeRepository;

    @Autowired
    public FundServiceImpl(FundRepository fundRepository, SchemeRepository schemeRepository) {
        this.fundRepository = fundRepository;
        this.schemeRepository = schemeRepository;
    }

    @Override
    @Transactional
    public FundResponse allocateFund(Long schemeId, BigDecimal allocatedAmount) {
        Scheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found with id " + schemeId));

        Fund fund = fundRepository.findBySchemeSchemeId(schemeId);
        if (fund == null) {
            fund = new Fund();
            fund.setScheme(scheme);
            fund.setTotalAllocatedAmount(allocatedAmount);
            fund.setTotalDistributedAmount(BigDecimal.ZERO);
        } else {
            fund.setTotalAllocatedAmount(fund.getTotalAllocatedAmount().add(allocatedAmount));
        }
        fund.setUpdatedAt(LocalDateTime.now());

        Fund saved = fundRepository.save(fund);
        return toResponse(saved);
    }

    @Override
    public FundResponse getFundBySchemeId(Long schemeId) {
        Fund fund = fundRepository.findBySchemeSchemeId(schemeId);
        if (fund == null) {
            throw new ResourceNotFoundException("Fund record not found for scheme id " + schemeId);
        }
        return toResponse(fund);
    }

    private FundResponse toResponse(Fund fund) {
        FundResponse resp = new FundResponse();
        resp.setFundId(fund.getFundId());
        resp.setSchemeId(fund.getScheme().getSchemeId());
        resp.setTotalAllocatedAmount(fund.getTotalAllocatedAmount());
        resp.setTotalDistributedAmount(fund.getTotalDistributedAmount());
        resp.setAvailableAmount(fund.getAvailableAmount());
        return resp;
    }
}
