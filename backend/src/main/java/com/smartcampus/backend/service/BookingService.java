package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.BookingDTO;
import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUser(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Optional<Booking> getBookingById(String id) {
        return bookingRepository.findById(id);
    }

    public Booking createBooking(BookingDTO dto) {
        // Check for time conflicts
        List<Booking> existingBookings = bookingRepository.findByResourceId(dto.getResourceId());

        for (Booking existing : existingBookings) {
            // Skip cancelled and rejected bookings
            if ("CANCELLED".equals(existing.getStatus()) || "REJECTED".equals(existing.getStatus())) {
                continue;
            }
            
            // Check if on same date
            if (!dto.getDate().equals(existing.getDate())) {
                continue;
            }
            
            // Check for time overlap
            if (hasTimeConflict(dto.getStartTime(), dto.getEndTime(), 
                              existing.getStartTime(), existing.getEndTime())) {
                throw new RuntimeException("Resource already booked for this time slot");
            }
        }

        // Create new booking
        Booking booking = new Booking();
        booking.setResourceId(dto.getResourceId());
        booking.setUserId(dto.getUserId());
        booking.setUserName(dto.getUserName());
        booking.setUserEmail(dto.getUserEmail());
        booking.setDate(dto.getDate());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setPurpose(dto.getPurpose());
        booking.setExpectedAttendees(dto.getExpectedAttendees());
        booking.setStatus("PENDING");
        
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
        booking.setCreatedAt(timestamp);
        booking.setUpdatedAt(timestamp);

        return bookingRepository.save(booking);
    }

    public Booking approveBooking(String id) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("Only PENDING bookings can be approved");
        }

        booking.setStatus("APPROVED");
        booking.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(String id, String reason) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("Only PENDING bookings can be rejected");
        }

        booking.setStatus("REJECTED");
        booking.setRejectionReason(reason);
        booking.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"APPROVED".equals(booking.getStatus())) {
            throw new RuntimeException("Only APPROVED bookings can be cancelled");
        }

        booking.setStatus("CANCELLED");
        booking.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return bookingRepository.save(booking);
    }

    public List<Booking> filterBookings(String status, String userId, String resourceId) {
        List<Booking> bookings = bookingRepository.findAll();

        return bookings.stream()
            .filter(b -> status == null || status.equals(b.getStatus()))
            .filter(b -> userId == null || userId.equals(b.getUserId()))
            .filter(b -> resourceId == null || resourceId.equals(b.getResourceId()))
            .collect(Collectors.toList());
    }

    private boolean hasTimeConflict(String newStart, String newEnd, 
                                   String existingStart, String existingEnd) {
        return newStart.compareTo(existingEnd) < 0 && newEnd.compareTo(existingStart) > 0;
    }
}
