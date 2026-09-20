package com.example.subsidyadmin.service.impl;

import com.example.subsidyadmin.dto.SchemeCreateRequest;
import com.example.subsidyadmin.dto.SchemeResponse;
import com.example.subsidyadmin.exception.ResourceNotFoundException;
import com.example.subsidyadmin.model.Scheme;
import com.example.subsidyadmin.repository.SchemeRepository;
import com.example.subsidyadmin.service.SchemeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchemeServiceImpl implements SchemeService {

    private final SchemeRepository schemeRepository;


    @Autowired
    public SchemeServiceImpl(SchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }


    // =====================================================
    // CREATE SCHEME
    // =====================================================

    @Override
    @Transactional
    public SchemeResponse createScheme(SchemeCreateRequest request) {

        Scheme scheme = new Scheme();

        scheme.setSchemeName(request.getName());

        scheme.setDescription(
                request.getDescription()
        );

        scheme.setMaximumAmount(
                request.getMaximumAmount()
        );

        scheme.setStatus(
                request.getStatus() != null
                        ? request.getStatus()
                        : "ACTIVE"
        );

        // Convert LocalDateTime -> LocalDate
        if (request.getStartDate() != null) {

            scheme.setStartDate(
                    request.getStartDate().toLocalDate()
            );
        }

        // Database has one deadline field.
        // Use endDate as the scheme deadline.
        if (request.getEndDate() != null) {

            scheme.setDeadline(
                    request.getEndDate().toLocalDate()
            );

        } else if (request.getApplicationDeadline() != null) {

            scheme.setDeadline(
                    request.getApplicationDeadline().toLocalDate()
            );
        }

        scheme.setCreatedAt(
                LocalDateTime.now()
        );

        Scheme savedScheme =
                schemeRepository.save(scheme);

        return toResponse(savedScheme);
    }


    // =====================================================
    // GET SCHEME BY ID
    // =====================================================

    @Override
    public SchemeResponse getSchemeById(Long schemeId) {

        Scheme scheme =
                schemeRepository.findById(schemeId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Scheme not found with id "
                                                + schemeId
                                )
                        );

        return toResponse(scheme);
    }


    // =====================================================
    // LIST SCHEMES
    // =====================================================

    @Override
    public Page<SchemeResponse> listSchemes(
            Pageable pageable) {

        Page<Scheme> schemePage =
                schemeRepository.findAll(pageable);

        List<SchemeResponse> responseList =
                schemePage.getContent()
                        .stream()
                        .map(this::toResponse)
                        .collect(Collectors.toList());

        return new PageImpl<>(
                responseList,
                pageable,
                schemePage.getTotalElements()
        );
    }


    // =====================================================
    // UPDATE SCHEME
    // =====================================================

    @Override
    @Transactional
    public SchemeResponse updateScheme(
            Long schemeId,
            SchemeCreateRequest request) {

        Scheme scheme =
                schemeRepository.findById(schemeId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Scheme not found with id "
                                                + schemeId
                                )
                        );

        if (request.getName() != null) {

            scheme.setSchemeName(
                    request.getName()
            );
        }

        if (request.getDescription() != null) {

            scheme.setDescription(
                    request.getDescription()
            );
        }

        if (request.getMaximumAmount() != null) {

            scheme.setMaximumAmount(
                    request.getMaximumAmount()
            );
        }

        if (request.getStatus() != null) {

            scheme.setStatus(
                    request.getStatus()
            );
        }

        if (request.getStartDate() != null) {

            scheme.setStartDate(
                    request.getStartDate().toLocalDate()
            );
        }

        if (request.getEndDate() != null) {

            scheme.setDeadline(
                    request.getEndDate().toLocalDate()
            );

        } else if (request.getApplicationDeadline() != null) {

            scheme.setDeadline(
                    request.getApplicationDeadline().toLocalDate()
            );
        }

        scheme.setUpdatedAt(
                LocalDateTime.now()
        );

        Scheme savedScheme =
                schemeRepository.save(scheme);

        return toResponse(savedScheme);
    }


    // =====================================================
    // DEACTIVATE SCHEME
    // =====================================================

    @Override
    @Transactional
    public void deactivateScheme(Long schemeId) {

        Scheme scheme =
                schemeRepository.findById(schemeId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Scheme not found with id "
                                                + schemeId
                                )
                        );

        scheme.setStatus("INACTIVE");

        scheme.setUpdatedAt(
                LocalDateTime.now()
        );

        schemeRepository.save(scheme);
    }

    @Override
    @Transactional
    public void deleteScheme(Long schemeId) {

        Scheme scheme =
                schemeRepository.findById(schemeId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Scheme not found with id "
                                                + schemeId
                                )
                        );

        schemeRepository.delete(scheme);
    }



    // =====================================================
    // ENTITY -> RESPONSE
    // =====================================================

    private SchemeResponse toResponse(
            Scheme scheme) {

        SchemeResponse response =
                new SchemeResponse();

        response.setSchemeId(
                scheme.getSchemeId()
        );

        response.setName(
                scheme.getSchemeName()
        );

        response.setSchemeName(
                scheme.getSchemeName()
        );

        response.setSchemeType(
                scheme.getSchemeType()
        );

        response.setTotalFund(
                scheme.getTotalFund()
        );

        response.setDescription(
                scheme.getDescription()
        );

        response.setMaximumAmount(
                scheme.getMaximumAmount()
        );

        response.setStatus(
                scheme.getStatus()
        );

        if (scheme.getStartDate() != null) {

            response.setStartDate(
                    scheme.getStartDate()
                            .atStartOfDay()
            );
        }

        if (scheme.getDeadline() != null) {

            LocalDateTime deadline =
                    scheme.getDeadline()
                            .atStartOfDay();

            response.setEndDate(deadline);

            response.setApplicationDeadline(
                    deadline
            );
        }

        return response;
    }
}