package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.dto.SchemeCreateRequest;
import com.example.subsidyadmin.dto.SchemeResponse;
import com.example.subsidyadmin.security.CustomUserDetailsService;
import com.example.subsidyadmin.security.JwtTokenProvider;
import com.example.subsidyadmin.repository.UserRepository;
import com.example.subsidyadmin.service.SchemeService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import org.springframework.http.MediaType;

import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(SchemeController.class)
@AutoConfigureMockMvc(addFilters = false)
public class SchemeControllerTest {


    @Autowired
    private MockMvc mockMvc;


    @Autowired
    private ObjectMapper objectMapper;


    @MockBean
    private SchemeService schemeService;


    @MockBean
    private JwtTokenProvider jwtTokenProvider;


    @MockBean
    private CustomUserDetailsService customUserDetailsService;


    @MockBean
    private UserRepository userRepository;


    private SchemeResponse sampleResponse;


    @BeforeEach
    void setUp() {

        sampleResponse = new SchemeResponse();

        sampleResponse.setSchemeId(1L);

        sampleResponse.setSchemeName(
                "Tech Subsidy"
        );

        sampleResponse.setDescription(
                "Technology grant"
        );

        sampleResponse.setSchemeType(
                "SUBSIDY"
        );

        sampleResponse.setTotalFund(
                new BigDecimal("500000")
        );

        sampleResponse.setMaximumAmount(
                new BigDecimal("25000")
        );

        sampleResponse.setStatus(
                "ACTIVE"
        );
    }


    // =====================================================
    // GET SCHEME BY ID
    // =====================================================

    @Test
    void testGetSchemeById() throws Exception {

        Mockito.when(
                schemeService.getSchemeById(1L)
        ).thenReturn(sampleResponse);


        mockMvc.perform(
                        get("/api/schemes/1")
                )

                .andExpect(
                        status().isOk()
                )

                .andExpect(
                        jsonPath("$.schemeId")
                                .value(1)
                )

                .andExpect(
                        jsonPath("$.schemeName")
                                .value("Tech Subsidy")
                );
    }


    // =====================================================
    // LIST SCHEMES
    // =====================================================

    @Test
    void testListSchemes() throws Exception {

        Mockito.when(
                schemeService.listSchemes(
                        any(Pageable.class)
                )
        ).thenReturn(
                new PageImpl<>(
                        Collections.singletonList(
                                sampleResponse
                        )
                )
        );


        mockMvc.perform(
                        get("/api/schemes")
                                .param("page", "0")
                                .param("size", "20")
                )

                .andExpect(
                        status().isOk()
                )

                .andExpect(
                        jsonPath(
                                "$.content[0].schemeName"
                        ).value("Tech Subsidy")
                );
    }


    // =====================================================
    // CREATE SCHEME
    // =====================================================

    @Test
    void testCreateScheme() throws Exception {

        SchemeCreateRequest request =
                new SchemeCreateRequest();


        // REQUIRED FIELD
        request.setName(
                "Tech Subsidy"
        );


        request.setDescription(
                "Technology grant"
        );


        request.setSchemeType(
                "SUBSIDY"
        );


        request.setTotalFund(
                new BigDecimal("500000")
        );


        request.setMaximumAmount(
                new BigDecimal("25000")
        );


        /*
         * IMPORTANT:
         * SchemeCreateRequest uses LocalDateTime.
         */

        LocalDateTime startDate =
                LocalDateTime.now()
                        .plusDays(1);


        LocalDateTime endDate =
                LocalDateTime.now()
                        .plusMonths(3);


        LocalDateTime applicationDeadline =
                LocalDateTime.now()
                        .plusMonths(2);


        request.setStartDate(
                startDate
        );


        request.setEndDate(
                endDate
        );


        request.setApplicationDeadline(
                applicationDeadline
        );


        request.setCreatedByUserId(
                1L
        );


        request.setStatus(
                "ACTIVE"
        );


        Mockito.when(
                schemeService.createScheme(
                        any(SchemeCreateRequest.class)
                )
        ).thenReturn(
                sampleResponse
        );


        mockMvc.perform(
                        post("/api/schemes")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper.writeValueAsString(
                                                request
                                        )
                                )
                )

                .andExpect(
                        status().isOk()
                )

                .andExpect(
                        jsonPath("$.schemeId")
                                .value(1)
                );
    }


    

    @Test
    void testDeactivateScheme() throws Exception {

        Mockito.doNothing()
                .when(schemeService)
                .deactivateScheme(1L);


        mockMvc.perform(
                        delete("/api/schemes/1")
                )

                .andExpect(
                        status().isNoContent()
                );
    }
}