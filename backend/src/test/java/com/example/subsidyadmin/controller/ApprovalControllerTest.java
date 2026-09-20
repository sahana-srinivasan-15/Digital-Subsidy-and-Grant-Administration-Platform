package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.dto.ApprovalRequest;
import com.example.subsidyadmin.dto.ApprovalResponse;
import com.example.subsidyadmin.repository.UserRepository;
import com.example.subsidyadmin.security.CustomUserDetailsService;
import com.example.subsidyadmin.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ApprovalController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ApprovalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private com.example.subsidyadmin.service.ApprovalService approvalService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private UserRepository userRepository;

    private ApprovalResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleResponse = new ApprovalResponse();
        sampleResponse.setApprovalId(2L);
        sampleResponse.setDecision("APPROVED");
        sampleResponse.setApprovedAmount(new BigDecimal("30000"));
        sampleResponse.setDecisionDate(LocalDateTime.now());
    }

    @Test
    void testCreateApproval() throws Exception {
        ApprovalRequest request = new ApprovalRequest();
        request.setApplicationId(1L);
        request.setAuthorityId(2L);
        request.setDecision("APPROVED");
        request.setApprovedAmount(new BigDecimal("30000"));
        request.setAuthorityComments("Application approved after verification");

        Mockito.when(approvalService.createApproval(any(ApprovalRequest.class)))
                .thenReturn(sampleResponse);

        mockMvc.perform(post("/api/approvals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.approvalId").value(2))
                .andExpect(jsonPath("$.decision").value("APPROVED"));
    }
}
