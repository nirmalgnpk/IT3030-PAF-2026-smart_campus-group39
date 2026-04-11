package com.smartcampus.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String userName;
    private String name;
    private String email;
    private String password;
    private String role;
    private byte[] profilePhoto;      // ← blob stored in MongoDB
    private String profilePhotoType;  // ← e.g. "image/jpeg", "image/png"

    public User() {}

    public User(String userName, String name, String email,
                String password, String role) {
        this.userName = userName;
        this.name     = name;
        this.email    = email;
        this.password = password;
        this.role     = role;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public byte[] getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(byte[] profilePhoto) { this.profilePhoto = profilePhoto; }

    public String getProfilePhotoType() { return profilePhotoType; }
    public void setProfilePhotoType(String profilePhotoType) { this.profilePhotoType = profilePhotoType; }
}