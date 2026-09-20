package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.dto.UserCreateRequest;
import com.example.subsidyadmin.dto.UserProfileResponse;
import com.example.subsidyadmin.exception.BusinessException;
import com.example.subsidyadmin.exception.ResourceNotFoundException;
import com.example.subsidyadmin.model.Role;
import com.example.subsidyadmin.model.User;
import com.example.subsidyadmin.repository.RefreshTokenRepository;
import com.example.subsidyadmin.repository.RoleRepository;
import com.example.subsidyadmin.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMINISTRATOR')")
public class UserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserRepository userRepository,
                          RoleRepository roleRepository,
                          RefreshTokenRepository refreshTokenRepository,
                          @Autowired(required = false) PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<UserProfileResponse>> listAllUsers() {
        List<UserProfileResponse> users = userRepository.findAll().stream()
                .filter(u -> u.getDeletedAt() == null)
                .filter(u -> u.getEmail() != null
                        && !u.getEmail().equalsIgnoreCase("verifier@gov.in")
                        && !u.getEmail().equalsIgnoreCase("authority@gov.in")
                        && !u.getEmail().equalsIgnoreCase("admin@gov.in"))
                .map(u -> new UserProfileResponse(
                        u.getUserId(),
                        u.getName(),
                        u.getEmail(),
                        u.getRole() != null ? u.getRole().getRoleName() : "APPLICANT",
                        u.getPhone(),
                        u.getAddress()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<UserProfileResponse> createUser(@Valid @RequestBody UserCreateRequest request) {
        String cleanEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        if (userRepository.findByEmailIgnoreCase(cleanEmail) != null || userRepository.findByEmail(cleanEmail) != null) {
            throw new BusinessException("A user with email '" + cleanEmail + "' is already registered.");
        }

        String targetRoleName = request.getRole() != null ? request.getRole().trim().toUpperCase() : "APPLICANT";
        Role role = roleRepository.findByRoleName(targetRoleName);
        if (role == null) {
            role = roleRepository.findByRoleName("ROLE_" + targetRoleName);
        }
        if (role == null) {
            role = new Role();
            role.setRoleName(targetRoleName);
            role.setCreatedAt(LocalDateTime.now());
            role.setUpdatedAt(LocalDateTime.now());
            role = roleRepository.save(role);
        }

        User newUser = new User();
        newUser.setName(request.getName() != null ? request.getName().trim() : "");
        newUser.setEmail(cleanEmail);

        String rawPassword = (request.getPassword() != null && !request.getPassword().isBlank()) 
                ? request.getPassword() 
                : "Welcome@2026";
        String encodedPassword = (passwordEncoder != null) ? passwordEncoder.encode(rawPassword) : rawPassword;
        newUser.setPassword(encodedPassword);

        newUser.setPhone(request.getPhone());
        String addressOrDept = request.getDepartment() != null && !request.getDepartment().isBlank() 
                ? request.getDepartment().trim() 
                : request.getAddress();
        newUser.setAddress(addressOrDept);
        newUser.setRole(role);
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(newUser);

        return ResponseEntity.ok(new UserProfileResponse(
                saved.getUserId(),
                saved.getName(),
                saved.getEmail(),
                saved.getRole() != null ? saved.getRole().getRoleName() : targetRoleName,
                saved.getPhone(),
                saved.getAddress()
        ));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

        // Clean up refresh tokens
        try {
            refreshTokenRepository.deleteByUserUserId(id);
        } catch (Exception ignored) {}

        // Soft-delete user or remove
        try {
            userRepository.delete(user);
        } catch (Exception e) {
            // In case of foreign key audit logs or related records, mark as soft-deleted
            user.setDeletedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        }

        return ResponseEntity.noContent().build();
    }
}
