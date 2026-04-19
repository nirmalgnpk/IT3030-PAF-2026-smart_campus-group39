package com.smartcampus.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;
    private String userId;
    private String type;
    private String title;
    private String message;
    private boolean read = false;
    private String relatedId;
    private LocalDateTime createdAt;

    public Notification() {
        this.createdAt = LocalDateTime.now();
    }

    public Notification(String userId, String type, String title, String message, String relatedId) {
        this.userId    = userId;
        this.type      = type;
        this.title     = title;
        this.message   = message;
        this.relatedId = relatedId;
        this.read      = false;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    public String getRelatedId() { return relatedId; }
    public void setRelatedId(String relatedId) { this.relatedId = relatedId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}