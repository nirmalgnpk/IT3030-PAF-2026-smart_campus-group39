package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable String userId) {
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(userId)));
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody Map<String, String> body) {
        String userId    = body.get("userId");
        String type      = body.get("type");
        String title     = body.get("title");
        String message   = body.get("message");
        String relatedId = body.getOrDefault("relatedId", "");

        if (userId  == null || userId.isBlank())  return ResponseEntity.badRequest().body(Map.of("message", "userId is required"));
        if (type    == null || type.isBlank())    return ResponseEntity.badRequest().body(Map.of("message", "type is required"));
        if (title   == null || title.isBlank())   return ResponseEntity.badRequest().body(Map.of("message", "title is required"));
        if (message == null || message.isBlank()) return ResponseEntity.badRequest().body(Map.of("message", "message is required"));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(notificationService.createNotification(userId, type, title, message, relatedId));
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable String notificationId) {
        if (!notificationService.markAsRead(notificationId))
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Notification not found"));
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(@PathVariable String userId) {
        int count = notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read", "updated", String.valueOf(count)));
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, String>> deleteNotification(@PathVariable String notificationId) {
        if (!notificationService.deleteNotification(notificationId))
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Notification not found"));
        return ResponseEntity.ok(Map.of("message", "Notification deleted"));
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Map<String, String>> deleteAllForUser(@PathVariable String userId) {
        notificationService.deleteAllForUser(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications deleted for this user"));
    }
}