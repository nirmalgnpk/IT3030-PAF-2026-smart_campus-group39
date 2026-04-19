package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.AssignTechnicianDTO;
import com.smartcampus.backend.dto.CreateIncidentTicketDTO;
import com.smartcampus.backend.dto.TechnicianUpdateDTO;
import com.smartcampus.backend.dto.UpdateTicketStatusDTO;
import com.smartcampus.backend.model.IncidentTicket;
import com.smartcampus.backend.model.TechnicianUpdate;
import com.smartcampus.backend.model.TicketAttachment;
import com.smartcampus.backend.model.TicketStatus;
import com.smartcampus.backend.repository.IncidentTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class IncidentTicketService {

    @Autowired
    private IncidentTicketRepository incidentTicketRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<IncidentTicket> getAllTickets(TicketStatus status) {
        if (status != null) {
            return incidentTicketRepository.findByStatus(status);
        }
        return incidentTicketRepository.findAll();
    }

    public List<IncidentTicket> getTicketsByAssignedTechnician(String assignedTechnician) {
        return incidentTicketRepository.findByAssignedTechnician(assignedTechnician);
    }

    public Optional<IncidentTicket> getTicketById(String id) {
        return incidentTicketRepository.findById(id);
    }

    public IncidentTicket createTicket(CreateIncidentTicketDTO dto, MultipartFile[] files) throws IOException {
        IncidentTicket ticket = new IncidentTicket();
        ticket.setTitle(dto.getTitle());
        ticket.setCategory(dto.getCategory());
        ticket.setDescription(dto.getDescription());
        ticket.setLocation(dto.getLocation());
        ticket.setPriority(dto.getPriority());
        ticket.setPreferredContact(dto.getPreferredContact());
        ticket.setCreatedBy(dto.getCreatedBy());

        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                if(!file.isEmpty()) {
                    String fileName = fileStorageService.store(file);
                    TicketAttachment attachment = new TicketAttachment();
                    attachment.setFileName(file.getOriginalFilename());
                    attachment.setFileType(file.getContentType());
                    attachment.setFilePath("/uploads/tickets/" + fileName); // Adjust path logic based on your frontend config
                    ticket.getAttachments().add(attachment);
                }
            }
        }
        return incidentTicketRepository.save(ticket);
    }

    public IncidentTicket assignTechnician(String id, AssignTechnicianDTO dto) {
        IncidentTicket ticket = incidentTicketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setAssignedTechnician(dto.getAssignedTechnician());
        return incidentTicketRepository.save(ticket);
    }

    public IncidentTicket updateStatus(String id, UpdateTicketStatusDTO dto) {
        IncidentTicket ticket = incidentTicketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(dto.getStatus());
        if (dto.getResolutionNote() != null) {
            ticket.setResolutionNote(dto.getResolutionNote());
        }
        return incidentTicketRepository.save(ticket);
    }

    public IncidentTicket addUpdate(String id, TechnicianUpdateDTO dto) {
        IncidentTicket ticket = incidentTicketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        TechnicianUpdate update = new TechnicianUpdate();
        update.setMessage(dto.getMessage());
        update.setUpdatedBy(dto.getUpdatedBy());
        ticket.getUpdates().add(update);
        return incidentTicketRepository.save(ticket);
    }

    public void deleteTicket(String id) {
        incidentTicketRepository.deleteById(id);
    }
}