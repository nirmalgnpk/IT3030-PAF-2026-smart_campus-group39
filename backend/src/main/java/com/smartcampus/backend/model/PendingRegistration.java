package com.smartcampus.backend.model;

public class PendingRegistration {
    private String name;
    private String userName;
    private String email;
    private String encodedPassword;
    private String role;

    public PendingRegistration(String name, String userName, String email,
                               String encodedPassword, String role) {
        this.name            = name;
        this.userName        = userName;
        this.email           = email;
        this.encodedPassword = encodedPassword;
        this.role            = role;
    }

    // Getters
    public String getName()            { return name; }
    public String getUserName()        { return userName; }
    public String getEmail()           { return email; }
    public String getEncodedPassword() { return encodedPassword; }
    public String getRole()            { return role; }
}