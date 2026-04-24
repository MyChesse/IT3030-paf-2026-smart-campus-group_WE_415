package com.campus.notifications.service;

import com.campus.notifications.entity.AppNotification;
import com.campus.notifications.repository.AppNotificationRepository;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final AppNotificationRepository appNotificationRepository;

    public NotificationService(AppNotificationRepository appNotificationRepository) {
        this.appNotificationRepository = appNotificationRepository;
    }

    public void createNotification(Long userId, String type, String title, String message) {
        AppNotification notification = new AppNotification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);
        appNotificationRepository.save(notification);
    }
}