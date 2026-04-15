package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.AssignTechnicianDTO;
import com.smartcampus.backend.dto.CreateIncidentTicketDTO;
import com.smartcampus.backend.dto.TechnicianUpdateDTO;
import com.smartcampus.backend.dto.UpdateTicketStatusDTO;
import com.smartcampus.backend.model.*;
import com.smartcampus.backend.repository.IncidentTicketRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class IncidentTicketService {

    private final IncidentTicketRepository ticketRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public IncidentTicketService(IncidentTicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public IncidentTicket createTicket(CreateIncidentTicketDTO dto, MultipartFile[] files) throws IOException {

        if (files != null && files.length > 3) {
            throw new RuntimeException("Maximum 3 attachments allowed");
        }

        IncidentTicket ticket = new IncidentTicket();
        ticket.setTitle(dto.getTitle());
        ticket.setCategory(dto.getCategory());
        ticket.setDescription(dto.getDescription());
        ticket.setLocation(dto.getLocation());
        ticket.setPriority(dto.getPriority());
        ticket.setPreferredContact(dto.getPreferredContact());
        ticket.setCreatedBy(dto.getCreatedBy());
        ticket.setStatus(TicketStatus.OPEN);

        if (files != null) {
            Files.createDirectories(Paths.get(uploadDir));

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {

                    String contentType = file.getContentType();
                    if (contentType == null || !contentType.startsWith("image/")) {
                        throw new RuntimeException("Only image files allowed");
                    }

                    String uniqueName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    Path filePath = Paths.get(uploadDir, uniqueName);
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                    TicketAttachment attachment = new TicketAttachment();
                    attachment.setFileName(file.getOriginalFilename());
                    attachment.setFileType(file.getContentType());
                    attachment.setFilePath("/uploads/tickets/" + uniqueName);

                    ticket.getAttachments().add(attachment);
                }
            }
        }

        return ticketRepository.save(ticket);
    }

    public List<IncidentTicket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public IncidentTicket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public List<IncidentTicket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }

    public IncidentTicket assignTechnician(String id, AssignTechnicianDTO dto) {
        IncidentTicket ticket = getTicketById(id);
        ticket.setAssignedTechnician(dto.getAssignedTechnician());
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        return ticketRepository.save(ticket);
    }

    public IncidentTicket updateStatus(String id, UpdateTicketStatusDTO dto) {
        IncidentTicket ticket = getTicketById(id);
        ticket.setStatus(dto.getStatus());

        if (dto.getResolutionNote() != null) {
            ticket.setResolutionNote(dto.getResolutionNote());
        }

        return ticketRepository.save(ticket);
    }

    public IncidentTicket addTechnicianUpdate(String id, TechnicianUpdateDTO dto) {
        IncidentTicket ticket = getTicketById(id);

        TechnicianUpdate update = new TechnicianUpdate();
        update.setMessage(dto.getMessage());
        update.setUpdatedBy(dto.getUpdatedBy());

        ticket.getUpdates().add(update);

        return ticketRepository.save(ticket);
    }
}