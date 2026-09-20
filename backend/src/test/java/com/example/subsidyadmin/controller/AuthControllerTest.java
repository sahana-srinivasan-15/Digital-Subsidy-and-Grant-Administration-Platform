package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.dto.LoginRequest;
import com.example.subsidyadmin.dto.RefreshRequest;
import com.example.subsidyadmin.dto.LogoutRequest;
import com.example.subsidyadmin.model.RefreshToken;
import com.example.subsidyadmin.model.User;
import com.example.subsidyadmin.model.Role;
import com.example.subsidyadmin.repository.RefreshTokenRepository;
import com.example.subsidyadmin.repository.UserRepository;
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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AuthController.class, excludeAutoConfiguration = {org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class, org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration.class, org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration.class, org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class, org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration.class})
@AutoConfigureMockMvc(addFilters = false) // disable security for unit test
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private RefreshTokenRepository refreshTokenRepository;

    @MockBean
    private com.example.subsidyadmin.security.CustomUserDetailsService customUserDetailsService;

    @MockBean
    private com.example.subsidyadmin.security.JwtAuthenticationFilter jwtAuthenticationFilter;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setUserId(1L);
        sampleUser.setEmail("john@example.com");
        sampleUser.setPassword("hashed");
        // role is needed for token generation but can be null for this test
        Role role = new Role();
        role.setRoleName("APPLICANT");

        sampleUser.setRole(role);
    }

    @Test
    void testLogin() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("john@example.com");
        request.setPassword("pwd");

        Authentication auth = new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
        Mockito.when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        Mockito.when(userRepository.findByEmail(eq("john@example.com"))).thenReturn(sampleUser);
        Mockito.when(jwtTokenProvider.generateAccessToken(eq(1L), any(String.class))).thenReturn("access-token");
        Mockito.when(jwtTokenProvider.generateRefreshToken(eq(1L))).thenReturn("refresh-token");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access-token"))
                .andExpect(jsonPath("$.refreshToken").value("refresh-token"));
    }

    @Test
    void testRefresh() throws Exception {
        RefreshRequest request = new RefreshRequest();
        request.setRefreshToken("valid-refresh");
        RefreshToken rt = new RefreshToken();
        rt.setToken("valid-refresh");
        rt.setRevoked(false);
        rt.setExpiryDate(java.time.LocalDateTime.now().plusDays(1));
        rt.setUser(sampleUser);
        Mockito.when(refreshTokenRepository.findByToken(eq("valid-refresh"))).thenReturn(java.util.Optional.of(rt));
        Mockito.when(jwtTokenProvider.generateAccessToken(eq(1L), any(String.class))).thenReturn("new-access");

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("new-access"));
    }

    @Test
    void testLogout() throws Exception {
        LogoutRequest request = new LogoutRequest();
        request.setRefreshToken("some-token");
        RefreshToken rt = new RefreshToken();
        rt.setToken("some-token");
        rt.setRevoked(false);
        rt.setExpiryDate(java.time.LocalDateTime.now().plusDays(1));
        rt.setUser(sampleUser);
        Mockito.when(refreshTokenRepository.findByToken(eq("some-token"))).thenReturn(java.util.Optional.of(rt));

        mockMvc.perform(post("/api/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
        // verify that token was revoked
        Mockito.verify(refreshTokenRepository).save(Mockito.argThat(t -> t.isRevoked()));
    }
}
