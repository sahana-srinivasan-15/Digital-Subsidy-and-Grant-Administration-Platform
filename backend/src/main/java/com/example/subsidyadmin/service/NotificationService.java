package com.example.subsidyadmin.service;

import com.example.subsidyadmin.dto.NotificationResponse;
import java.util.List;

public interface NotificationService {
    NotificationResponse sendNotification(Long userId, String title, String message, String type);
    NotificationResponse sendGlobalNotification(String title, String message, String type);
    List<NotificationResponse> listNotificationsByUser(Long userId);
    List<NotificationResponse> listNotificationsForAuthenticatedUser(Long userId);
    Long getUnreadCountForUser(Long userId);
    void markAsRead(Long notificationId);
    void markAsRead(Long notificationId, Long authenticatedUserId, boolean isAdmin);
    void markAllAsReadForUser(Long userId);
}

