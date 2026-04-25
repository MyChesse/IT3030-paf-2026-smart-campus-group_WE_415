package com.campus.booking.controller;

import com.campus.booking.dto.BookingCreateRequestDto;
import com.campus.booking.dto.BookingResponseDto;
import com.campus.booking.dto.BookingStatusUpdateDto;
import com.campus.booking.entity.BookingStatus;
import com.campus.booking.service.BookingService;
import com.campus.auth.entity.AppUser;
import com.campus.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;
    private final AuthService authService;

    public BookingController(BookingService bookingService, AuthService authService) {
        this.bookingService = bookingService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(
            @Valid @RequestBody BookingCreateRequestDto request,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        Long userId = authService.resolveUserId(authHeader, fallbackUserId);
        return ResponseEntity.status(201).body(bookingService.createBooking(request, userId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDto>> getMyBookings(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        Long userId = authService.resolveUserId(authHeader, fallbackUserId);
        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        AppUser user = authService.getCurrentUser(authHeader, fallbackUserId);
        ensureAdminLike(user);
        return ResponseEntity.ok(bookingService.getAllBookings(status, startDate, endDate));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<BookingResponseDto> approveBooking(
            @PathVariable Long id,
            @RequestBody BookingStatusUpdateDto dto,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        AppUser user = authService.getCurrentUser(authHeader, fallbackUserId);
        ensureAdminLike(user);
        return ResponseEntity.ok(bookingService.approveBooking(id, dto.reason(), user.getId()));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<BookingResponseDto> rejectBooking(
            @PathVariable Long id,
            @RequestBody BookingStatusUpdateDto dto,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        AppUser user = authService.getCurrentUser(authHeader, fallbackUserId);
        ensureAdminLike(user);
        return ResponseEntity.ok(bookingService.rejectBooking(id, dto.reason(), user.getId()));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDto> cancelBooking(
            @PathVariable Long id,
            @RequestBody(required = false) BookingStatusUpdateDto dto,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        String reason = dto != null && dto.reason() != null ? dto.reason() : "Cancelled by user";
        AppUser user = authService.getCurrentUser(authHeader, fallbackUserId);
        boolean isAdminLike = user.getRoles().contains("ADMIN") || user.getRoles().contains("STAFF");
        return ResponseEntity.ok(bookingService.cancelBooking(id, reason, user.getId(), isAdminLike));
    }

    private void ensureAdminLike(AppUser user) {
        boolean isAdminLike = user.getRoles().contains("ADMIN") || user.getRoles().contains("STAFF");
        if (!isAdminLike) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }
    }
}
