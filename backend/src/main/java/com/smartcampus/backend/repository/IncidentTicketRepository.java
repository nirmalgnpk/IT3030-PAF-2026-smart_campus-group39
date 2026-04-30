package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.IncidentTicket;
import com.smartcampus.backend.model.TicketPriority;
import com.smartcampus.backend.model.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface IncidentTicketRepository extends MongoRepository<IncidentTicket, String> {

    List<IncidentTicket> findByStatus(TicketStatus status);

    List<IncidentTicket> findByPriority(TicketPriority priority);

    List<IncidentTicket> findByAssignedTechnician(String assignedTechnician);
}