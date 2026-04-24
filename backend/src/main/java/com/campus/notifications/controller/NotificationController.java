package com.campus.notifications.controller;

import com.campus.auth.service.AuthService;
import com.campus.notifications.entity.AppNotification;
import com.campus.notifications.repository.AppNotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final AppNotificationRepository appNotificationRepository;
    private final AuthService authService;

    public NotificationController(AppNotificationRepository appNotificationRepository, AuthService authService) {
        this.appNotificationRepository = appNotificationRepository;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotifications(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Long userId = authService.resolveUserId(authHeader);
        Page<AppNotification> result = appNotificationRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(page, size));

        return ResponseEntity.ok(Map.of(
                "content", result.getContent(),
                "totalPages", result.getTotalPages(),
                "totalElements", result.getTotalElements()
        ));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Long userId = authService.resolveUserId(authHeader);
        long count = appNotificationRepository.countByUserIdAndReadFalse(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable Long id) {
        AppNotification notification = appNotificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        appNotificationRepository.save(notification);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Long userId = authService.resolveUserId(authHeader);
        appNotificationRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 1000))
                .forEach(notification -> {
                    notification.setRead(true);
                    appNotificationRepository.save(notification);
                });

        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNotification(@PathVariable Long id) {
        AppNotification notification = appNotificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        appNotificationRepository.delete(notification);
        return ResponseEntity.ok(Map.of("message", "Notification deleted"));
    }
}
