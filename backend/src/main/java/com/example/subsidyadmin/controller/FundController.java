package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.dto.FundResponse;
import com.example.subsidyadmin.service.FundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/funds")
public class FundController {

    private final FundService fundService;

    @Autowired
    public FundController(FundService fundService) {
        this.fundService = fundService;
    }

    @PostMapping("/allocate/{schemeId}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<FundResponse> allocateFund(@PathVariable Long schemeId, @RequestParam BigDecimal amount) {
        FundResponse response = fundService.allocateFund(schemeId, amount);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/scheme/{schemeId}")
    public ResponseEntity<FundResponse> getFundByScheme(@PathVariable Long schemeId) {
        FundResponse response = fundService.getFundBySchemeId(schemeId);
        return ResponseEntity.ok(response);
    }
}
