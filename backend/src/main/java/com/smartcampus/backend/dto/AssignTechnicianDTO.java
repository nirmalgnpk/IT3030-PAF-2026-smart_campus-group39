package com.smartcampus.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignTechnicianDTO {

    @NotBlank
    private String assignedTechnician;

    // 🔥 getters and setters

    public String getAssignedTechnician() {
        return assignedTechnician;
    }

    public void setAssignedTechnician(String assignedTechnician) {
        this.assignedTechnician = assignedTechnician;
    }
}