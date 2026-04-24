package com.campus.booking.service;

import com.campus.booking.dto.BookingCreateRequestDto;
import com.campus.booking.dto.BookingResponseDto;
import com.campus.booking.entity.Booking;
import com.campus.booking.entity.BookingStatus;
import com.campus.booking.exception.BookingConflictException;
import com.campus.booking.repository.BookingRepository;
import com.campus.notifications.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository, NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
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

        Booking saved = bookingRepository.save(booking);
        notifyBookingOwner(saved, "BOOKING_APPROVED", "Booking approved",
            "Your booking request for resource #" + saved.getResourceId() + " has been approved.");

        return toDto(saved);
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

    Booking saved = bookingRepository.save(booking);
    notifyBookingOwner(saved, "BOOKING_REJECTED", "Booking rejected",
        buildStatusMessage(saved, "rejected", reason));

    return toDto(saved);
    }

    @Transactional
    public BookingResponseDto cancelBooking(Long bookingId, String reason, Long userId, boolean isAdminLike) {
        Booking booking = findBooking(bookingId);

        if (!isAdminLike && !booking.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only cancel your own bookings");
        }

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalArgumentException("Only APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason != null ? reason : "Cancelled by user");

    Booking saved = bookingRepository.save(booking);
    notifyBookingOwner(saved, "BOOKING_CANCELLED", "Booking cancelled",
        buildStatusMessage(saved, "cancelled", saved.getCancellationReason()));

    return toDto(saved);
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

    private void notifyBookingOwner(Booking booking, String type, String title, String message) {
        notificationService.createNotification(booking.getUserId(), type, title, message);
    }

    private String buildStatusMessage(Booking booking, String status, String reason) {
        StringBuilder message = new StringBuilder("Your booking request for resource #")
                .append(booking.getResourceId())
                .append(" has been ")
                .append(status)
                .append('.');

        if (reason != null && !reason.trim().isEmpty()) {
            message.append(" Reason: ").append(reason.trim());
        }

        return message.toString();
    }
}
