package com.smartcampus.backend.dto;

public class AuthResponseDTO {
    private String token;
    private String id;
    private String name;
    private String email;
    private String role;
    private String userName;
    private boolean profilePhoto;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public boolean isProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(boolean profilePhoto) { this.profilePhoto = profilePhoto; }
}