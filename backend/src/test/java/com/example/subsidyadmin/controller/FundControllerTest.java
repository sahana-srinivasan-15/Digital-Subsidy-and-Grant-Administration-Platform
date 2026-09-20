package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.dto.FundResponse;
import com.example.subsidyadmin.repository.UserRepository;
import com.example.subsidyadmin.security.CustomUserDetailsService;
import com.example.subsidyadmin.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FundController.class)
@AutoConfigureMockMvc(addFilters = false)
public class FundControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private com.example.subsidyadmin.service.FundService fundService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private UserRepository userRepository;

    private FundResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleResponse = new FundResponse();
        sampleResponse.setFundId(1L);
        sampleResponse.setTotalAllocatedAmount(new BigDecimal("1000000"));
        sampleResponse.setTotalDistributedAmount(new BigDecimal("30000"));
    }

    @Test
    void testGetFundBySchemeId() throws Exception {
        Mockito.when(fundService.getFundBySchemeId(1L)).thenReturn(sampleResponse);
        mockMvc.perform(get("/api/funds/scheme/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fundId").value(1))
                .andExpect(jsonPath("$.totalAllocatedAmount").value(1000000));
    }
}
