package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Notification REST API
 *
 * All endpoints require: Authorization: Bearer <token>
 *
 * ── Postman test examples ──────────────────────────────────────────────────
 *
 * GET    http://localhost:8080/api/notifications/user/{userId}
 * GET    http://localhost:8080/api/notifications/user/{userId}/unread
 * GET    http://localhost:8080/api/notifications/user/{userId}/unread-count
 *
 * POST   http://localhost:8080/api/notifications
 * Body (JSON):
 * {
 *   "userId":    "abc123",
 *   "type":      "BOOKING",
 *   "title":     "Booking Confirmed",
 *   "message":   "Your booking for Room A has been confirmed.",
 *   "relatedId": "booking_id_here"
 * }
 *
 * PUT    http://localhost:8080/api/notifications/{notificationId}/read
 * PUT    http://localhost:8080/api/notifications/user/{userId}/read-all
 * DELETE http://localhost:8080/api/notifications/{notificationId}
 * DELETE http://localhost:8080/api/notifications/user/{userId}
 *
 * ── Notification types used by the system ──────────────────────────────────
 *  WELCOME        — on first registration
 *  LOGIN          — on each login (optional)
 *  BOOKING        — booking created / accepted / rejected
 *  TICKET         — ticket created / responded to
 *  RESOURCE       — new resource added
 *  PROFILE        — profile photo updated
 *  SYSTEM         — admin broadcast
 */
@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // GET all notifications for a user (newest first)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    // GET unread notifications for a user
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    // GET unread count badge
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable String userId) {
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(userId)));
    }

    // POST create a notification (used by admin, system, or via Postman)
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

    // POST send booking notification to a user (admin action)
    @PostMapping("/send/booking")
    public ResponseEntity<?> sendBookingNotification(@RequestBody Map<String, String> body) {
        String userId  = body.get("userId");
        String status  = body.getOrDefault("status", "CONFIRMED"); // CONFIRMED | REJECTED | PENDING
        String details = body.getOrDefault("details", "");
        String bookingId = body.getOrDefault("bookingId", "");

        if (userId == null || userId.isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "userId is required"));

        String title, message;
        switch (status.toUpperCase()) {
            case "CONFIRMED":
                title   = "Booking Confirmed";
                message = "Your booking has been confirmed." + (details.isBlank() ? "" : " " + details);
                break;
            case "REJECTED":
                title   = "Booking Rejected";
                message = "Your booking has been rejected." + (details.isBlank() ? "" : " Reason: " + details);
                break;
            default:
                title   = "Booking Update";
                message = "Your booking status has been updated to " + status + "." + (details.isBlank() ? "" : " " + details);
        }

        Notification n = notificationService.createNotification(userId, "BOOKING", title, message, bookingId);
        return ResponseEntity.status(HttpStatus.CREATED).body(n);
    }

    // POST send ticket notification to a user (admin response)
    @PostMapping("/send/ticket")
    public ResponseEntity<?> sendTicketNotification(@RequestBody Map<String, String> body) {
        String userId   = body.get("userId");
        String status   = body.getOrDefault("status", "RESPONDED");
        String response = body.getOrDefault("response", "");
        String ticketId = body.getOrDefault("ticketId", "");

        if (userId == null || userId.isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "userId is required"));

        String title   = "Ticket Update";
        String message = "Your support ticket has been " + status.toLowerCase() + "."
                + (response.isBlank() ? "" : " Admin response: " + response);

        Notification n = notificationService.createNotification(userId, "TICKET", title, message, ticketId);
        return ResponseEntity.status(HttpStatus.CREATED).body(n);
    }

    // POST send resource notification to all users (or specific user)
    @PostMapping("/send/resource")
    public ResponseEntity<?> sendResourceNotification(@RequestBody Map<String, String> body) {
        String userId       = body.get("userId");
        String resourceName = body.getOrDefault("resourceName", "A new resource");
        String resourceId   = body.getOrDefault("resourceId", "");

        if (userId == null || userId.isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "userId is required"));

        Notification n = notificationService.createNotification(
                userId, "RESOURCE",
                "New Resource Available",
                resourceName + " has been added to the campus resources. Book it now!",
                resourceId
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(n);
    }

    // POST broadcast a system message to ALL users
    @PostMapping("/broadcast")
    public ResponseEntity<?> broadcast(@RequestBody Map<String, String> body) {
        String title   = body.get("title");
        String message = body.get("message");

        if (title == null || title.isBlank())   return ResponseEntity.badRequest().body(Map.of("message", "title is required"));
        if (message == null || message.isBlank()) return ResponseEntity.badRequest().body(Map.of("message", "message is required"));

        int count = notificationService.broadcastToAll(title, message);
        return ResponseEntity.ok(Map.of("message", "Broadcast sent", "recipientCount", count));
    }

    // PUT mark a single notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable String notificationId) {
        if (!notificationService.markAsRead(notificationId))
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Notification not found"));
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    // PUT mark all notifications for a user as read
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@PathVariable String userId) {
        int count = notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read", "updated", count));
    }

    // DELETE a single notification
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, String>> deleteNotification(@PathVariable String notificationId) {
        if (!notificationService.deleteNotification(notificationId))
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Notification not found"));
        return ResponseEntity.ok(Map.of("message", "Notification deleted"));
    }

    // DELETE all notifications for a user
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Map<String, String>> deleteAllForUser(@PathVariable String userId) {
        notificationService.deleteAllForUser(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications deleted for user " + userId));
    }
}