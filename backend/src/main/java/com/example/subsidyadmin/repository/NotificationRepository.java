package com.example.subsidyadmin.repository;

import com.example.subsidyadmin.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserUserId(Long userId);
    List<Notification> findByUserUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(Long userId);
    List<Notification> findByIsRead(Boolean isRead);
    Optional<Notification> findByNotificationIdAndDeletedAtIsNull(Long notificationId);

    @Query("SELECT n FROM Notification n WHERE (n.user.userId = :userId OR n.isGlobal = true) AND n.deletedAt IS NULL ORDER BY n.createdAt DESC")
    List<Notification> findAccessibleNotificationsForUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE (n.user.userId = :userId OR n.isGlobal = true) AND n.isRead = false AND n.deletedAt IS NULL")
    Long countUnreadForUser(@Param("userId") Long userId);
}

