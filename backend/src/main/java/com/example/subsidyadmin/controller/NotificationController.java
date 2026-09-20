package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.dto.NotificationResponse;
import com.example.subsidyadmin.model.User;
import com.example.subsidyadmin.repository.UserRepository;
import com.example.subsidyadmin.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Autowired
    public NotificationController(NotificationService notificationService, UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    /**
     * Account-Specific: List notifications for the currently authenticated user.
     * Guaranteed backend-level isolation — never exposes another account's notifications.
     */
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> listMyNotifications(Authentication authentication) {
        User user = resolveAuthenticatedUser(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<NotificationResponse> list = notificationService.listNotificationsForAuthenticatedUser(user.getUserId());
        return ResponseEntity.ok(list);
    }

    /**
     * Account-Specific: Get unread count for the currently authenticated user.
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(Authentication authentication) {
        User user = resolveAuthenticatedUser(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Long unread = notificationService.getUnreadCountForUser(user.getUserId());
        Map<String, Object> res = new HashMap<>();
        res.put("unreadCount", unread != null ? unread : 0L);
        return ResponseEntity.ok(res);
    }

    /**
     * List notifications by user ID.
     * Enforces that authenticated user can ONLY access their own notifications, unless they are an ADMINISTRATOR.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> listByUser(
            @PathVariable Long userId,
            Authentication authentication) {
        User user = resolveAuthenticatedUser(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean isAdmin = user.getRole() != null && "ADMINISTRATOR".equalsIgnoreCase(user.getRole().getRoleName());
        if (!isAdmin && !user.getUserId().equals(userId)) {
            throw new AccessDeniedException("Access Denied: You are not authorized to view notifications for other accounts.");
        }

        List<NotificationResponse> list = notificationService.listNotificationsByUser(userId);
        return ResponseEntity.ok(list);
    }

    /**
     * Mark a single notification as read.
     * Enforces ownership so user cannot modify another user's notifications.
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {
        User user = resolveAuthenticatedUser(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean isAdmin = user.getRole() != null && "ADMINISTRATOR".equalsIgnoreCase(user.getRole().getRoleName());
        notificationService.markAsRead(id, user.getUserId(), isAdmin);
        return ResponseEntity.noContent().build();
    }

    /**
     * Bulk mark all notifications as read for the authenticated user only.
     */
    @PatchMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        User user = resolveAuthenticatedUser(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        notificationService.markAllAsReadForUser(user.getUserId());
        return ResponseEntity.noContent().build();
    }

    /**
     * Send targeted notification to a user or global announcement.
     */
    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(
            @RequestParam(required = false) Long userId,
            @RequestParam String title,
            @RequestParam String message,
            @RequestParam(defaultValue = "INFO") String type,
            @RequestParam(defaultValue = "false") Boolean isGlobal,
            Authentication authentication) {
        if (Boolean.TRUE.equals(isGlobal)) {
            NotificationResponse response = notificationService.sendGlobalNotification(title, message, type);
            return ResponseEntity.ok(response);
        }

        Long targetUserId = userId;
        if (targetUserId == null) {
            User current = resolveAuthenticatedUser(authentication);
            if (current != null) {
                targetUserId = current.getUserId();
            }
        }
        if (targetUserId == null) {
            return ResponseEntity.badRequest().build();
        }

        NotificationResponse response = notificationService.sendNotification(targetUserId, title, message, type);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<NotificationResponse> sendNotification(
            @PathVariable Long userId,
            @RequestParam String title,
            @RequestParam String message,
            @RequestParam(defaultValue = "INFO") String type) {
        NotificationResponse response = notificationService.sendNotification(userId, title, message, type);
        return ResponseEntity.ok(response);
    }

    private User resolveAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String email = authentication.getName();
        if (email == null) return null;
        User user = userRepository.findByEmailIgnoreCase(email.trim());
        if (user == null) {
            user = userRepository.findByEmail(email.trim());
        }
        return user;
    }
}

