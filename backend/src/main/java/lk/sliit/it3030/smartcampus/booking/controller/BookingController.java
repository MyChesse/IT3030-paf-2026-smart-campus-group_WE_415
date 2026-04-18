package lk.sliit.it3030.smartcampus.booking.controller;

import jakarta.validation.Valid;
import lk.sliit.it3030.smartcampus.booking.dto.BookingCreateRequestDto;
import lk.sliit.it3030.smartcampus.booking.dto.BookingResponseDto;
import lk.sliit.it3030.smartcampus.booking.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")   // For React frontend later
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * POST /api/bookings
     * Create a new booking request (PENDING status)
     */
    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(
            @Valid @RequestBody BookingCreateRequestDto request,
            @AuthenticationPrincipal Long userId) {     // Temporary - will be replaced with real auth later

        BookingResponseDto response = bookingService.createBooking(request, userId != null ? userId : 1L);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}