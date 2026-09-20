package com.example.subsidyadmin.service;

import com.example.subsidyadmin.dto.SchemeCreateRequest;
import com.example.subsidyadmin.dto.SchemeResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SchemeService {

    SchemeResponse createScheme(
            SchemeCreateRequest request
    );

    SchemeResponse getSchemeById(
            Long schemeId
    );

    Page<SchemeResponse> listSchemes(
            Pageable pageable
    );

    SchemeResponse updateScheme(
            Long schemeId,
            SchemeCreateRequest request
    );

    void deactivateScheme(
            Long schemeId
    );

    void deleteScheme(
            Long schemeId
    );
}