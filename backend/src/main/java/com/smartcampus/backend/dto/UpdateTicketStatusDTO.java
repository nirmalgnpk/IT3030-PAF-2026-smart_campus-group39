package com.smartcampus.backend.dto;

import com.smartcampus.backend.model.TicketStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateTicketStatusDTO {

    @NotNull
    private TicketStatus status;

    private String resolutionNote;

    // 🔥 getters and setters

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public String getResolutionNote() {
        return resolutionNote;
    }

    public void setResolutionNote(String resolutionNote) {
        this.resolutionNote = resolutionNote;
    }
}