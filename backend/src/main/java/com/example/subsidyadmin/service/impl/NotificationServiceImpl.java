package com.example.subsidyadmin.service.impl;

import com.example.subsidyadmin.dto.NotificationResponse;
import com.example.subsidyadmin.exception.ResourceNotFoundException;
import com.example.subsidyadmin.model.Notification;
import com.example.subsidyadmin.model.User;
import com.example.subsidyadmin.repository.NotificationRepository;
import com.example.subsidyadmin.repository.UserRepository;
import com.example.subsidyadmin.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public NotificationResponse sendNotification(Long userId, String title, String message, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        Notification notif = new Notification();
        notif.setUser(user);
        notif.setTitle(title);
        notif.setMessage(message);
        notif.setNotificationType(type != null ? type : "INFO");
        notif.setIsRead(false);
        notif.setIsGlobal(false);
        notif.setCreatedAt(LocalDateTime.now());

        Notification saved = notificationRepository.save(notif);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public NotificationResponse sendGlobalNotification(String title, String message, String type) {
        User admin = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && "ADMINISTRATOR".equalsIgnoreCase(u.getRole().getRoleName()))
                .findFirst()
                .orElseGet(() -> userRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("No administrative user found for system notification")));

        Notification notif = new Notification();
        notif.setUser(admin);
        notif.setTitle(title);
        notif.setMessage(message);
        notif.setNotificationType(type != null ? type : "INFO");
        notif.setIsRead(false);
        notif.setIsGlobal(true);
        notif.setCreatedAt(LocalDateTime.now());

        Notification saved = notificationRepository.save(notif);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> listNotificationsByUser(Long userId) {
        List<Notification> notifs = notificationRepository.findByUserUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(userId);
        return notifs.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> listNotificationsForAuthenticatedUser(Long userId) {
        List<Notification> notifs = notificationRepository.findAccessibleNotificationsForUser(userId);
        return notifs.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Long getUnreadCountForUser(Long userId) {
        return notificationRepository.countUnreadForUser(userId);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notif = notificationRepository.findByNotificationIdAndDeletedAtIsNull(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id " + notificationId));
        notif.setIsRead(true);
        notificationRepository.save(notif);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, Long authenticatedUserId, boolean isAdmin) {
        Notification notif = notificationRepository.findByNotificationIdAndDeletedAtIsNull(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id " + notificationId));

        if (!isAdmin && notif.getUser() != null && !notif.getUser().getUserId().equals(authenticatedUserId)) {
            throw new AccessDeniedException("Access Denied: You are not authorized to modify notifications belonging to another account.");
        }

        notif.setIsRead(true);
        notificationRepository.save(notif);
    }

    @Override
    @Transactional
    public void markAllAsReadForUser(Long userId) {
        List<Notification> notifs = notificationRepository.findAccessibleNotificationsForUser(userId);
        for (Notification n : notifs) {
            if (Boolean.FALSE.equals(n.getIsRead())) {
                n.setIsRead(true);
            }
        }
        notificationRepository.saveAll(notifs);
    }

    private NotificationResponse toResponse(Notification notif) {
        NotificationResponse resp = new NotificationResponse();
        resp.setNotificationId(notif.getNotificationId());
        if (notif.getUser() != null) {
            resp.setUserId(notif.getUser().getUserId());
            resp.setUserEmail(notif.getUser().getEmail());
        }
        resp.setTitle(notif.getTitle());
        resp.setMessage(notif.getMessage());
        resp.setNotificationType(notif.getNotificationType());
        resp.setIsRead(notif.getIsRead());
        resp.setIsGlobal(notif.getIsGlobal());
        resp.setCreatedAt(notif.getCreatedAt());
        return resp;
    }
}

