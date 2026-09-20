package com.example.subsidyadmin.service.impl;

import com.example.subsidyadmin.dto.VerificationRequest;
import com.example.subsidyadmin.dto.VerificationResponse;
import com.example.subsidyadmin.exception.BusinessException;
import com.example.subsidyadmin.exception.ResourceNotFoundException;
import com.example.subsidyadmin.model.Application;
import com.example.subsidyadmin.model.Verification;
import com.example.subsidyadmin.model.User;
import com.example.subsidyadmin.repository.ApplicationRepository;
import com.example.subsidyadmin.repository.UserRepository;
import com.example.subsidyadmin.repository.VerificationRepository;
import com.example.subsidyadmin.service.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VerificationServiceImpl implements VerificationService {

    private final VerificationRepository verificationRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    @Autowired
    public VerificationServiceImpl(VerificationRepository verificationRepository,
                                  ApplicationRepository applicationRepository,
                                  UserRepository userRepository) {
        this.verificationRepository = verificationRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public VerificationResponse verifyApplication(VerificationRequest request) {
        // Load application
        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id " + request.getApplicationId()));

        // Resolve verifier user
        User verifier = null;
        if (request.getVerifierId() != null) {
            verifier = userRepository.findById(request.getVerifierId()).orElse(null);
        }
        if (verifier == null) {
            verifier = userRepository.findAll().stream()
                    .filter(u -> u.getRole() != null && ("VERIFIER".equalsIgnoreCase(u.getRole().getRoleName()) || "ROLE_VERIFIER".equalsIgnoreCase(u.getRole().getRoleName())))
                    .findFirst()
                    .orElse(null);
        }
        if (verifier == null) {
            verifier = userRepository.findById(1L).orElseGet(() -> userRepository.findAll().stream().findFirst().orElseThrow(() -> new ResourceNotFoundException("No verifier available")));
        }

        // Validate score range (0-100)
        Double score = request.getVerificationScore();
        if (score == null || score < 0 || score > 100) {
            throw new BusinessException("Verification score must be between 0 and 100");
        }

        String status = request.getVerificationStatus() != null ? request.getVerificationStatus().toUpperCase() : "VERIFIED";

        Verification verification = new Verification();
        verification.setApplication(application);
        verification.setVerifier(verifier);
        verification.setVerificationScore(java.math.BigDecimal.valueOf(score));
        verification.setVerificationStatus(status);
        verification.setVerificationDate(LocalDateTime.now());
        verification.setRemarks(request.getVerifierComments());
        verification.setCreatedAt(LocalDateTime.now());

        Verification saved = verificationRepository.save(verification);

        // Status transition: if rejected or score < 40, set REJECTED; else VERIFIED
        if ("REJECTED".equalsIgnoreCase(status) || score < 40) {
            application.setApplicationStatus("REJECTED");
        } else {
            application.setApplicationStatus("VERIFIED");
        }
        applicationRepository.save(application);

        return toResponse(saved);
    }

    @Override
    public VerificationResponse getVerification(Long verificationId) {
        Verification verification = verificationRepository.findById(verificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Verification not found with id " + verificationId));
        return toResponse(verification);
    }

    @Override
    public List<VerificationResponse> listVerificationsByApplication(Long applicationId) {
        List<Verification> verifications = verificationRepository.findByApplicationApplicationId(applicationId);
        return verifications.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private VerificationResponse toResponse(Verification verification) {
        VerificationResponse resp = new VerificationResponse();
        resp.setVerificationId(verification.getVerificationId());
        resp.setApplicationId(verification.getApplication().getApplicationId());
        resp.setVerifierId(verification.getVerifier().getUserId());
        resp.setRemarks(verification.getRemarks());
        resp.setScore(verification.getVerificationScore() != null ? verification.getVerificationScore().intValue() : null);
        resp.setVerifiedAt(verification.getVerificationDate());
        return resp;
    }
}
