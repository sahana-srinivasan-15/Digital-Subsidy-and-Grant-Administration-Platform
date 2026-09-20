package com.example.subsidyadmin.service.impl;

import com.example.subsidyadmin.dto.ApplicationCreateRequest;
import com.example.subsidyadmin.dto.ApplicationResponse;
import com.example.subsidyadmin.exception.BusinessException;
import com.example.subsidyadmin.exception.ResourceNotFoundException;
import com.example.subsidyadmin.model.Application;
import com.example.subsidyadmin.model.Scheme;
import com.example.subsidyadmin.model.User;
import com.example.subsidyadmin.repository.ApplicationRepository;
import com.example.subsidyadmin.repository.SchemeRepository;
import com.example.subsidyadmin.repository.UserRepository;
import com.example.subsidyadmin.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final SchemeRepository schemeRepository;
    private final UserRepository userRepository;

    @Autowired
    public ApplicationServiceImpl(ApplicationRepository applicationRepository,
                                  SchemeRepository schemeRepository,
                                  UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.schemeRepository = schemeRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public ApplicationResponse createApplication(ApplicationCreateRequest request) {
        // Validate applicant exists
        User applicant = userRepository.findById(request.getApplicantId())
                .orElseThrow(() -> new ResourceNotFoundException("Applicant not found with id " + request.getApplicantId()));

        // Validate scheme exists and is ACTIVE
        Scheme scheme = schemeRepository.findById(request.getSchemeId())
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found with id " + request.getSchemeId()));
        if (!"ACTIVE".equalsIgnoreCase(scheme.getStatus())) {
            throw new BusinessException("Cannot apply to an inactive scheme.");
        }

        // Rule 2: Application cannot be submitted after scheme deadline
        LocalDateTime now = LocalDateTime.now();
        if (scheme.getDeadline() != null && java.time.LocalDate.now().isAfter(scheme.getDeadline())) {
            throw new BusinessException("Scheme deadline has passed. Cannot submit application.");
        }

        // Rule 3: Prevent duplicate application for same applicant & scheme
        boolean exists = applicationRepository
                .existsByApplicant_UserIdAndScheme_SchemeId(request.getApplicantId(), request.getSchemeId());
        if (exists) {
            throw new BusinessException("Applicant has already applied to this scheme.");
        }

        // Rule 4: Requested amount must not exceed scheme max amount
        if (scheme.getMaximumAmount() != null && request.getRequestedAmount().compareTo(scheme.getMaximumAmount()) > 0) {
            throw new BusinessException("Requested amount exceeds scheme's maximum amount.");
        }

        // Create and persist Application
        Application application = new Application();
        application.setApplicant(applicant);
        application.setScheme(scheme);
        application.setRequestedAmount(request.getRequestedAmount());
        application.setApplicationStatus("SUBMITTED");
        application.setSubmittedDate(now);
        application.setApplicationNumber(UUID.randomUUID().toString());
        application.setCreatedAt(now);
        application.setUpdatedAt(now);

        Application saved = applicationRepository.save(application);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id " + applicationId));
        return toResponse(app);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> listApplicationsByApplicant(Long applicantId, Pageable pageable) {
        Page<Application> page = applicationRepository.findAllByApplicant_UserId(applicantId, pageable);
        List<ApplicationResponse> content = page.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return new PageImpl<>(content, pageable, page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> listApplications(String status, Pageable pageable) {
        Page<Application> page;
        if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status.trim())) {
            page = applicationRepository.findByApplicationStatus(status.trim().toUpperCase(), pageable);
        } else {
            page = applicationRepository.findAll(pageable);
        }
        List<ApplicationResponse> content = page.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return new PageImpl<>(content, pageable, page.getTotalElements());
    }

    private ApplicationResponse toResponse(Application app) {
        ApplicationResponse resp = new ApplicationResponse();
        resp.setApplicationId(app.getApplicationId());
        resp.setApplicationNumber(app.getApplicationNumber());
        resp.setStatus(app.getApplicationStatus());
        resp.setApplicationStatus(app.getApplicationStatus());
        resp.setRequestedAmount(app.getRequestedAmount());
        resp.setSubmittedAt(app.getSubmittedDate());
        resp.setSubmittedDate(app.getSubmittedDate());
        resp.setUpdatedAt(app.getUpdatedAt());
        if (app.getApplicant() != null) {
            resp.setApplicantId(app.getApplicant().getUserId());
            resp.setApplicantName(app.getApplicant().getName());
            resp.setApplicantEmail(app.getApplicant().getEmail());
        }
        if (app.getScheme() != null) {
            resp.setSchemeId(app.getScheme().getSchemeId());
            resp.setSchemeName(app.getScheme().getSchemeName());
        }
        return resp;
    }
}
