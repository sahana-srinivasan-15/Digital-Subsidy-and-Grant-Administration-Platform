package com.example.subsidyadmin.service;

import com.example.subsidyadmin.dto.ApplicationCreateRequest;
import com.example.subsidyadmin.dto.ApplicationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ApplicationService {
    /**
     * Create a new application (initially in SUBMITTED status) after validating business rules.
     */
    ApplicationResponse createApplication(ApplicationCreateRequest request);

    ApplicationResponse getApplicationById(Long applicationId);

    Page<ApplicationResponse> listApplicationsByApplicant(Long applicantId, Pageable pageable);

    Page<ApplicationResponse> listApplications(String status, Pageable pageable);
}
