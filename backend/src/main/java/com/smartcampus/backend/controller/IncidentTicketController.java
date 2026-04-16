package com.smartcampus.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcampus.backend.dto.AssignTechnicianDTO;
import com.smartcampus.backend.dto.CreateIncidentTicketDTO;
import com.smartcampus.backend.dto.TechnicianUpdateDTO;
import com.smartcampus.backend.dto.UpdateTicketStatusDTO;
import com.smartcampus.backend.model.IncidentTicket;
import com.smartcampus.backend.model.TicketStatus;
import com.smartcampus.backend.service.IncidentTicketService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:3000")
public class IncidentTicketController {

    private final IncidentTicketService ticketService;
    private final ObjectMapper objectMapper;

    public IncidentTicketController(IncidentTicketService ticketService, ObjectMapper objectMapper) {
        this.ticketService = ticketService;
        this.objectMapper = objectMapper;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<IncidentTicket> createTicket(
            @RequestPart("ticket") String ticketJson,
            @RequestPart(value = "files", required = false) MultipartFile[] files) throws IOException {

        CreateIncidentTicketDTO dto = objectMapper.readValue(ticketJson, CreateIncidentTicketDTO.class);
        return ResponseEntity.ok(ticketService.createTicket(dto, files));
    }

    @GetMapping
    public ResponseEntity<List<IncidentTicket>> getAllTickets(
            @RequestParam(required = false) TicketStatus status) {

        if (status != null) {
            return ResponseEntity.ok(ticketService.getTicketsByStatus(status));
        }

        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentTicket> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<IncidentTicket> assignTechnician(
            @PathVariable String id,
            @Valid @RequestBody AssignTechnicianDTO dto) {

        return ResponseEntity.ok(ticketService.assignTechnician(id, dto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<IncidentTicket> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateTicketStatusDTO dto) {

        return ResponseEntity.ok(ticketService.updateStatus(id, dto));
    }

    @PostMapping("/{id}/updates")
    public ResponseEntity<IncidentTicket> addTechnicianUpdate(
            @PathVariable String id,
            @Valid @RequestBody TechnicianUpdateDTO dto) {

        return ResponseEntity.ok(ticketService.addTechnicianUpdate(id, dto));
    }
}