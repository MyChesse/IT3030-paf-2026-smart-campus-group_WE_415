package lk.sliit.it3030.smartcampus.booking.controller;

import jakarta.validation.Valid;
import lk.sliit.it3030.smartcampus.booking.dto.BookingCreateRequestDto;
import lk.sliit.it3030.smartcampus.booking.dto.BookingResponseDto;
import lk.sliit.it3030.smartcampus.booking.dto.BookingStatusUpdateDto;
import lk.sliit.it3030.smartcampus.booking.entity.BookingStatus;
import lk.sliit.it3030.smartcampus.booking.service.BookingService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // ==================== USER ENDPOINTS ====================

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(
            @Valid @RequestBody BookingCreateRequestDto request) {
        BookingResponseDto response = bookingService.createBooking(request, 1L);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDto>> getMyBookings() {
        List<BookingResponseDto> bookings = bookingService.getMyBookings(1L);
        return ResponseEntity.ok(bookings);
    }

    // ==================== ADMIN ENDPOINTS ====================

    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        List<BookingResponseDto> bookings = bookingService.getAllBookings(status, startDate, endDate);
        return ResponseEntity.ok(bookings);
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<BookingResponseDto> approveBooking(
            @PathVariable Long id,
            @RequestBody BookingStatusUpdateDto dto) {
        BookingResponseDto response = bookingService.approveBooking(id, dto.getReason(), 999L); // adminId temporary
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<BookingResponseDto> rejectBooking(
            @PathVariable Long id,
            @RequestBody BookingStatusUpdateDto dto) {
        BookingResponseDto response = bookingService.rejectBooking(id, dto.getReason(), 999L); // adminId temporary
        return ResponseEntity.ok(response);
    }
}