package com.smartcampus.backend.controller;

public class ForgotOtpRequest {

    private String email;

    public ForgotOtpRequest() {}

    public ForgotOtpRequest(String email) {
        this.email = email;
    }

    public String getEmail()               { return email; }
    public void   setEmail(String email)   { this.email = email; }
}
