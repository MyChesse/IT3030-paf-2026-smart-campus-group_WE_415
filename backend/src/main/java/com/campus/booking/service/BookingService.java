package com.campus.booking.service;

import com.campus.booking.dto.BookingCreateRequestDto;
import com.campus.booking.dto.BookingResponseDto;
import com.campus.booking.entity.Booking;
import com.campus.booking.entity.BookingStatus;
import com.campus.booking.exception.BookingConflictException;
import com.campus.booking.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public BookingResponseDto createBooking(BookingCreateRequestDto request, Long userId) {
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                request.resourceId(), request.startTime(), request.endTime());

        if (!overlapping.isEmpty()) {
            throw new BookingConflictException("Resource is already booked for the selected time period");
        }

        Booking booking = new Booking();
        booking.setResourceId(request.resourceId());
        booking.setUserId(userId);
        booking.setStartTime(request.startTime());
        booking.setEndTime(request.endTime());
        booking.setPurpose(request.purpose());
        booking.setExpectedAttendees(request.expectedAttendees());
        booking.setStatus(BookingStatus.PENDING);

        return toDto(bookingRepository.save(booking));
    }

    public List<BookingResponseDto> getMyBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream().map(this::toDto).toList();
    }

    public List<BookingResponseDto> getAllBookings(BookingStatus status, LocalDateTime startDate, LocalDateTime endDate) {
        List<Booking> bookings = status != null ? bookingRepository.findByStatus(status) : bookingRepository.findAll();

        if (startDate != null && endDate != null) {
            bookings = bookings.stream()
                    .filter(booking -> !booking.getStartTime().isBefore(startDate)
                    && !booking.getEndTime().isAfter(endDate))
                    .toList();
        }

        return bookings.stream().map(this::toDto).toList();
    }

    @Transactional
    public BookingResponseDto approveBooking(Long bookingId, String reason, Long adminId) {
        Booking booking = findBooking(bookingId);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING bookings can be approved");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setRejectionReason(null);
        booking.setCancellationReason(null);
        return toDto(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponseDto rejectBooking(Long bookingId, String reason, Long adminId) {
        Booking booking = findBooking(bookingId);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING bookings can be rejected");
        }

        if (reason == null || reason.trim().isEmpty()) {
            throw new IllegalArgumentException("Rejection reason is required");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);
        return toDto(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponseDto cancelBooking(Long bookingId, String reason, Long userId) {
        Booking booking = findBooking(bookingId);

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalArgumentException("Only APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason != null ? reason : "Cancelled by user");
        return toDto(bookingRepository.save(booking));
    }

    private Booking findBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
    }

    private BookingResponseDto toDto(Booking booking) {
        return new BookingResponseDto(
                booking.getId(),
                booking.getResourceId(),
                booking.getUserId(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getExpectedAttendees(),
                booking.getStatus(),
                booking.getRejectionReason(),
                booking.getCancellationReason(),
                booking.getCreatedAt(),
                booking.getUpdatedAt()
        );
    }
}
