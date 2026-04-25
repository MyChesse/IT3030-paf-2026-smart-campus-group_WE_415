package com.campus.notifications.service;

import com.campus.auth.entity.AppUser;
import com.campus.auth.repository.AppUserRepository;
import com.campus.notifications.entity.AppNotification;
import com.campus.notifications.repository.AppNotificationRepository;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class NotificationService {

    private final AppNotificationRepository appNotificationRepository;
    private final AppUserRepository appUserRepository;

    public NotificationService(AppNotificationRepository appNotificationRepository, AppUserRepository appUserRepository) {
        this.appNotificationRepository = appNotificationRepository;
        this.appUserRepository = appUserRepository;
    }

    public void createNotification(Long userId, String type, String title, String message) {
        if (userId == null || !isUserRecipient(userId)) {
            return;
        }

        AppNotification notification = new AppNotification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);
        appNotificationRepository.save(notification);
    }

    private boolean isUserRecipient(Long userId) {
        return appUserRepository.findById(userId)
                .map(this::isUserOnlyRole)
                .orElse(false);
    }

    private boolean isUserOnlyRole(AppUser user) {
        Set<String> roles = user.getRoles();
        if (roles.contains("ADMIN") || roles.contains("STAFF") || roles.contains("TECHNICIAN")) {
            return false;
        }
        return roles.contains("USER");
    }
}