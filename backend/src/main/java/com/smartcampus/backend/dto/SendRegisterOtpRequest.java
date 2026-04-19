package com.smartcampus.backend.dto;

public class SendRegisterOtpRequest {

    private String name;
    private String userName;
    private String email;
    private String password;
    private String role;

    public SendRegisterOtpRequest() {}

    public SendRegisterOtpRequest(String name, String userName, String email,
                                  String password, String role) {
        this.name     = name;
        this.userName = userName;
        this.email    = email;
        this.password = password;
        this.role     = role;
    }

    public String getName()                { return name; }
    public void   setName(String name)     { this.name = name; }

    public String getUserName()                    { return userName; }
    public void   setUserName(String userName)     { this.userName = userName; }

    public String getEmail()               { return email; }
    public void   setEmail(String email)   { this.email = email; }

    public String getPassword()                    { return password; }
    public void   setPassword(String password)     { this.password = password; }

    public String getRole()                { return role; }
    public void   setRole(String role)     { this.role = role; }
}