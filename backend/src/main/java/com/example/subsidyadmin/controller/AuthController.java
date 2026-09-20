package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.model.RefreshToken;
import com.example.subsidyadmin.model.User;
import com.example.subsidyadmin.repository.RefreshTokenRepository;
import com.example.subsidyadmin.repository.UserRepository;
import com.example.subsidyadmin.security.JwtTokenProvider;
import com.example.subsidyadmin.dto.LoginRequest;
import com.example.subsidyadmin.dto.LoginResponse;
import com.example.subsidyadmin.dto.RefreshRequest;
import com.example.subsidyadmin.dto.RefreshResponse;
import com.example.subsidyadmin.dto.LogoutRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

import com.example.subsidyadmin.model.Role;
import com.example.subsidyadmin.repository.RoleRepository;
import com.example.subsidyadmin.dto.RegisterRequest;
import com.example.subsidyadmin.dto.UserProfileResponse;
import com.example.subsidyadmin.exception.BusinessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider,
                          UserRepository userRepository,
                          RefreshTokenRepository refreshTokenRepository,
                          @Autowired(required = false) RoleRepository roleRepository,
                          @Autowired(required = false) PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        String cleanEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(cleanEmail, request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = userRepository.findByEmailIgnoreCase(cleanEmail);
        if (user == null) {
            user = userRepository.findByEmail(cleanEmail);
        }
        String roleName = (user != null && user.getRole() != null) ? user.getRole().getRoleName() : "APPLICANT";
        Long uid = user != null ? user.getUserId() : 1L;
        String uName = user != null ? user.getName() : "User";
        String uEmail = user != null ? user.getEmail() : cleanEmail;
        String accessToken = tokenProvider.generateAccessToken(uid, roleName);
        String refreshTokenStr = tokenProvider.generateRefreshToken(uid);
        // Persist refresh token
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(refreshTokenStr);
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));
        refreshToken.setRevoked(false);
        refreshTokenRepository.save(refreshToken);
        return ResponseEntity.ok(new LoginResponse(accessToken, refreshTokenStr, uid, uName, uEmail, roleName));
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        String cleanEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        if (userRepository.findByEmailIgnoreCase(cleanEmail) != null || userRepository.findByEmail(cleanEmail) != null) {
            throw new BusinessException("Email already registered: " + cleanEmail);
        }

        Role applicantRole = null;
        if (roleRepository != null) {
            applicantRole = roleRepository.findByRoleName("APPLICANT");
            if (applicantRole == null) {
                applicantRole = roleRepository.findByRoleName("ROLE_APPLICANT");
            }
            if (applicantRole == null) {
                applicantRole = new Role();
                applicantRole.setRoleName("APPLICANT");
                applicantRole = roleRepository.save(applicantRole);
            }
        }

        User newUser = new User();
        newUser.setName(request.getName() != null ? request.getName().trim() : "");
        newUser.setEmail(cleanEmail);
        String encodedPassword = (passwordEncoder != null) ? passwordEncoder.encode(request.getPassword()) : request.getPassword();
        newUser.setPassword(encodedPassword);
        newUser.setPhone(request.getPhone());
        newUser.setAddress(request.getDistrict() != null ? request.getDistrict() : request.getAddress());
        newUser.setRole(applicantRole);
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(newUser);

        String roleName = (savedUser.getRole() != null) ? savedUser.getRole().getRoleName() : "APPLICANT";
        String accessToken = tokenProvider.generateAccessToken(savedUser.getUserId(), roleName);
        String refreshTokenStr = tokenProvider.generateRefreshToken(savedUser.getUserId());

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(refreshTokenStr);
        refreshToken.setUser(savedUser);
        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));
        refreshToken.setRevoked(false);
        refreshTokenRepository.save(refreshToken);

        return ResponseEntity.ok(new LoginResponse(accessToken, refreshTokenStr, savedUser.getUserId(), savedUser.getName(), savedUser.getEmail(), roleName));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(authentication.getName());
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        String roleName = (user.getRole() != null) ? user.getRole().getRoleName() : "APPLICANT";
        return ResponseEntity.ok(new UserProfileResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                roleName,
                user.getPhone(),
                user.getAddress()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refresh(@RequestBody RefreshRequest request) {
        String refreshTokenStr = request.getRefreshToken();
        Optional<RefreshToken> optional = refreshTokenRepository.findByToken(refreshTokenStr);
        if (optional.isEmpty() || optional.get().getRevoked() || optional.get().getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(401).build();
        }
        RefreshToken refreshToken = optional.get();
        User user = refreshToken.getUser();
        String newAccessToken = tokenProvider.generateAccessToken(user.getUserId(), user.getRole().getRoleName());
        return ResponseEntity.ok(new RefreshResponse(newAccessToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody LogoutRequest request) {
        String refreshTokenStr = request.getRefreshToken();
        Optional<RefreshToken> optional = refreshTokenRepository.findByToken(refreshTokenStr);
        optional.ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
        return ResponseEntity.ok().build();
    }
}
