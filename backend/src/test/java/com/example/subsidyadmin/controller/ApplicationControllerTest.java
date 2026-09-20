package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.dto.ApplicationCreateRequest;
import com.example.subsidyadmin.dto.ApplicationResponse;
import com.example.subsidyadmin.repository.UserRepository;
import com.example.subsidyadmin.security.CustomUserDetailsService;
import com.example.subsidyadmin.security.JwtTokenProvider;
import com.example.subsidyadmin.service.ApplicationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ApplicationController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ApplicationService applicationService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private UserRepository userRepository;

    private ApplicationResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleResponse = new ApplicationResponse();
        sampleResponse.setApplicationId(10L);
        sampleResponse.setApplicationNumber("APP-999");
        sampleResponse.setApplicantId(1L);
        sampleResponse.setApplicantName("Jane Doe");
        sampleResponse.setSchemeId(2L);
        sampleResponse.setSchemeName("Agritech Subsidy");
        sampleResponse.setRequestedAmount(new BigDecimal("15000"));
        sampleResponse.setApplicationStatus("SUBMITTED");
        sampleResponse.setSubmittedDate(LocalDateTime.now());
    }

    @Test
    void testGetApplicationById() throws Exception {
        Mockito.when(applicationService.getApplicationById(10L)).thenReturn(sampleResponse);

        mockMvc.perform(get("/api/applications/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.applicationId").value(10))
                .andExpect(jsonPath("$.applicationNumber").value("APP-999"))
                .andExpect(jsonPath("$.applicationStatus").value("SUBMITTED"));
    }

    @Test
    void testCreateApplication() throws Exception {
        ApplicationCreateRequest request = new ApplicationCreateRequest();
        request.setApplicantId(1L);
        request.setSchemeId(2L);
        request.setRequestedAmount(new BigDecimal("15000"));

        Mockito.when(applicationService.createApplication(any(ApplicationCreateRequest.class)))
                .thenReturn(sampleResponse);

        mockMvc.perform(post("/api/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.applicationId").value(10))
                .andExpect(jsonPath("$.applicationNumber").value("APP-999"));
    }

    @Test
    void testListByApplicant() throws Exception {
        Mockito.when(applicationService.listApplicationsByApplicant(eq(1L), any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.singletonList(sampleResponse)));

        mockMvc.perform(get("/api/applications/applicant/1?page=0&size=20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].applicationId").value(10))
                .andExpect(jsonPath("$.content[0].applicantName").value("Jane Doe"));
    }
}
