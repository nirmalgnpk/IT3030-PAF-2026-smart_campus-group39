package com.smartcampus.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class TechnicianUpdateDTO {

    @NotBlank
    private String message;

    @NotBlank
    private String updatedBy;

    // 🔥 getters and setters

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}