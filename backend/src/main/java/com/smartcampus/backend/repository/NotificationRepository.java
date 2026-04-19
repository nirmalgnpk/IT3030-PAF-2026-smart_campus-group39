package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(String userId);
    long countByUserIdAndReadFalse(String userId);
    void deleteByUserId(String userId);
}