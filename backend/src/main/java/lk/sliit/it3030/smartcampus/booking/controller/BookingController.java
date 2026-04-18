package lk.sliit.it3030.smartcampus.booking.controller;

import jakarta.validation.Valid;
import lk.sliit.it3030.smartcampus.booking.dto.BookingCreateRequestDto;
import lk.sliit.it3030.smartcampus.booking.dto.BookingResponseDto;
import lk.sliit.it3030.smartcampus.booking.entity.BookingStatus;
import lk.sliit.it3030.smartcampus.booking.service.BookingService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
            @Valid @RequestBody BookingCreateRequestDto request,
            @AuthenticationPrincipal Long userId) {

        BookingResponseDto response = bookingService.createBooking(request, userId != null ? userId : 1L);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDto>> getMyBookings(
            @AuthenticationPrincipal Long userId) {

        List<BookingResponseDto> bookings = bookingService.getMyBookings(userId != null ? userId : 1L);
        return ResponseEntity.ok(bookings);
    }

    // ==================== ADMIN ENDPOINTS ====================

    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @AuthenticationPrincipal Long userId) {

        List<BookingResponseDto> bookings = bookingService.getAllBookings(status, startDate, endDate);
        return ResponseEntity.ok(bookings);
    }
}