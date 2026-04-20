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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private IncidentTicketService incidentTicketService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<IncidentTicket>> getAllTickets(@RequestParam(required = false) TicketStatus status,
                                                              @RequestParam(required = false) String assignedTechnician) {
        if (assignedTechnician != null) {
            return ResponseEntity.ok(incidentTicketService.getTicketsByAssignedTechnician(assignedTechnician));
        }
        return ResponseEntity.ok(incidentTicketService.getAllTickets(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentTicket> getTicketById(@PathVariable String id) {
        return incidentTicketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createTicket(@RequestPart("ticket") String ticketJson,
                                          @RequestPart(value = "files", required = false) MultipartFile[] files) {
        try {
            CreateIncidentTicketDTO dto = objectMapper.readValue(ticketJson, CreateIncidentTicketDTO.class);
            IncidentTicket created = incidentTicketService.createTicket(dto, files);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing ticket: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<IncidentTicket> assignTechnician(@PathVariable String id, @Valid @RequestBody AssignTechnicianDTO dto) {
        return ResponseEntity.ok(incidentTicketService.assignTechnician(id, dto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<IncidentTicket> updateStatus(@PathVariable String id, @Valid @RequestBody UpdateTicketStatusDTO dto) {
        return ResponseEntity.ok(incidentTicketService.updateStatus(id, dto));
    }

    @PostMapping("/{id}/updates")
    public ResponseEntity<IncidentTicket> addUpdate(@PathVariable String id, @Valid @RequestBody TechnicianUpdateDTO dto) {
        return ResponseEntity.ok(incidentTicketService.addUpdate(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable String id) {
        return incidentTicketService.getTicketById(id)
                .map(ticket -> {
                    incidentTicketService.deleteTicket(id);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}