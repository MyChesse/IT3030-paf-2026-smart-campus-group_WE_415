package com.campus.booking.controller;

import com.campus.booking.dto.BookingCreateRequestDto;
import com.campus.booking.dto.BookingResponseDto;
import com.campus.booking.dto.BookingStatusUpdateDto;
import com.campus.booking.entity.BookingStatus;
import com.campus.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private static final Long DEFAULT_USER_ID = 1L;
    private static final Long DEFAULT_ADMIN_ID = 999L;

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(@Valid @RequestBody BookingCreateRequestDto request) {
        return ResponseEntity.status(201).body(bookingService.createBooking(request, DEFAULT_USER_ID));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDto>> getMyBookings() {
        return ResponseEntity.ok(bookingService.getMyBookings(DEFAULT_USER_ID));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(bookingService.getAllBookings(status, startDate, endDate));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<BookingResponseDto> approveBooking(
            @PathVariable Long id,
            @RequestBody BookingStatusUpdateDto dto) {
        return ResponseEntity.ok(bookingService.approveBooking(id, dto.reason(), DEFAULT_ADMIN_ID));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<BookingResponseDto> rejectBooking(
            @PathVariable Long id,
            @RequestBody BookingStatusUpdateDto dto) {
        return ResponseEntity.ok(bookingService.rejectBooking(id, dto.reason(), DEFAULT_ADMIN_ID));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDto> cancelBooking(
            @PathVariable Long id,
            @RequestBody(required = false) BookingStatusUpdateDto dto) {
        String reason = dto != null && dto.reason() != null ? dto.reason() : "Cancelled by user";
        return ResponseEntity.ok(bookingService.cancelBooking(id, reason, DEFAULT_USER_ID));
    }
}
