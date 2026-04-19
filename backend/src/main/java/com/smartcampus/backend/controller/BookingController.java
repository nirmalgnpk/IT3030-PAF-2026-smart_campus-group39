package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.BookingDTO;
import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3005", "http://localhost:5173"})
public class BookingController {

    @Autowired
    private BookingService bookingService;

    /**
     * GET /api/bookings
     * Get all bookings with optional filters
     * ADMIN only
     */
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String resourceId) {
        
        // TODO: Add @PreAuthorize("hasRole('ADMIN')") or similar security check
        
        List<Booking> bookings = bookingService.filterBookings(status, userId, resourceId);
        return ResponseEntity.ok(bookings);
    }

    /**
     * GET /api/bookings/{id}
     * Get a specific booking by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * GET /api/bookings/user/{userId}
     * Get all bookings for a specific user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable String userId) {
        List<Booking> bookings = bookingService.getBookingsByUser(userId);
        return ResponseEntity.ok(bookings);
    }

    /**
     * POST /api/bookings
     * Create a new booking
     * Returns 201 CREATED on success
     * Returns 409 CONFLICT if time slot is already booked
     */
    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingDTO bookingDTO) {
        try {
            Booking booking = bookingService.createBooking(bookingDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("already booked")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ErrorResponse(e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * PUT /api/bookings/{id}/approve
     * Approve a pending booking
     * ADMIN only
     * Returns 200 OK
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable String id) {
        // TODO: Add @PreAuthorize("hasRole('ADMIN')") or similar security check
        
        try {
            Booking booking = bookingService.approveBooking(id);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * PUT /api/bookings/{id}/reject
     * Reject a pending booking with a reason
     * ADMIN only
     * Returns 200 OK
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectBooking(
            @PathVariable String id,
            @Valid @RequestBody RejectRequest rejectRequest) {
        
        // TODO: Add @PreAuthorize("hasRole('ADMIN')") or similar security check
        
        try {
            Booking booking = bookingService.rejectBooking(id, rejectRequest.getReason());
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * PUT /api/bookings/{id}/cancel
     * Cancel an approved booking
     * Returns 200 OK
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable String id) {
        try {
            Booking booking = bookingService.cancelBooking(id);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * DELETE /api/bookings/{id}
     * Hard delete a booking
     * ADMIN only
     * Returns 204 NO CONTENT
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable String id) {
        // TODO: Add @PreAuthorize("hasRole('ADMIN')") or similar security check
        
        try {
            Optional<Booking> booking = bookingService.getBookingById(id);
            if (booking.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            bookingService.deleteBooking(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Helper class for rejection request body
     */
    public static class RejectRequest {
        private String reason;

        public RejectRequest() {}

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }

    /**
     * Helper class for error responses
     */
    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
