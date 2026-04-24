package com.campus.notifications.repository;

import com.campus.notifications.entity.AppNotification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppNotificationRepository extends JpaRepository<AppNotification, Long> {
    Page<AppNotification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    long countByUserIdAndReadFalse(Long userId);
}
