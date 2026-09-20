package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.dto.VerificationRequest;
import com.example.subsidyadmin.dto.VerificationResponse;
import com.example.subsidyadmin.service.VerificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/verifications")
public class VerificationController {

    private final VerificationService verificationService;

    @Autowired
    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('VERIFIER')")
    public ResponseEntity<VerificationResponse> verifyApplication(@Valid @RequestBody VerificationRequest request) {
        VerificationResponse response = verificationService.verifyApplication(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VerificationResponse> getVerification(@PathVariable Long id) {
        VerificationResponse response = verificationService.getVerification(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<VerificationResponse>> listByApplication(@PathVariable Long applicationId) {
        List<VerificationResponse> list = verificationService.listVerificationsByApplication(applicationId);
        return ResponseEntity.ok(list);
    }
}
