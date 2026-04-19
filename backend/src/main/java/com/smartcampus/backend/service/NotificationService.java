package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.NotificationRepository;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired private NotificationRepository notificationRepository;
    @Autowired private UserRepository userRepository;

    public Notification createNotification(String userId, String type,
                                           String title, String message, String relatedId) {
        return notificationRepository.save(
                new Notification(userId, type, title, message, relatedId)
        );
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public boolean markAsRead(String notificationId) {
        Optional<Notification> optional = notificationRepository.findById(notificationId);
        if (optional.isPresent()) {
            Notification n = optional.get();
            n.setRead(true);
            notificationRepository.save(n);
            return true;
        }
        return false;
    }

    public int markAllAsRead(String userId) {
        List<Notification> unread =
                notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        return unread.size();
    }

    public boolean deleteNotification(String notificationId) {
        if (notificationRepository.existsById(notificationId)) {
            notificationRepository.deleteById(notificationId);
            return true;
        }
        return false;
    }

    public void deleteAllForUser(String userId) {
        notificationRepository.deleteByUserId(userId);
    }

    /**
     * Broadcast a SYSTEM notification to every user in the database.
     * Returns the number of users notified.
     */
    public int broadcastToAll(String title, String message) {
        List<User> allUsers = userRepository.findAll();
        List<Notification> notifications = allUsers.stream()
                .map(u -> new Notification(u.getId(), "SYSTEM", title, message, ""))
                .toList();
        notificationRepository.saveAll(notifications);
        return notifications.size();
    }
}