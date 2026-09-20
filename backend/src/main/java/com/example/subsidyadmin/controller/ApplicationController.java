package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.dto.ApplicationCreateRequest;
import com.example.subsidyadmin.dto.ApplicationResponse;
import com.example.subsidyadmin.service.ApplicationService;
import com.example.subsidyadmin.util.PaginationUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    @Autowired
    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<ApplicationResponse> createApplication(@Valid @RequestBody ApplicationCreateRequest request) {
        ApplicationResponse created = applicationService.createApplication(request);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplication(@PathVariable Long id) {
        ApplicationResponse app = applicationService.getApplicationById(id);
        return ResponseEntity.ok(app);
    }

    @GetMapping("/applicant/{applicantId}")
    public ResponseEntity<Page<ApplicationResponse>> listByApplicant(
            @PathVariable Long applicantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PaginationUtil.createPageable(page, size);
        Page<ApplicationResponse> apps = applicationService.listApplicationsByApplicant(applicantId, pageable);
        return ResponseEntity.ok(apps);
    }

    @GetMapping
    public ResponseEntity<Page<ApplicationResponse>> listAllApplications(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Pageable pageable = PaginationUtil.createPageable(page, size);
        Page<ApplicationResponse> apps = applicationService.listApplications(status, pageable);
        return ResponseEntity.ok(apps);
    }
}
