package lk.sliit.it3030.smartcampus.booking.service;

import lk.sliit.it3030.smartcampus.booking.dto.BookingCreateRequestDto;
import lk.sliit.it3030.smartcampus.booking.dto.BookingResponseDto;
import lk.sliit.it3030.smartcampus.booking.entity.Booking;
import lk.sliit.it3030.smartcampus.booking.entity.BookingStatus;
import lk.sliit.it3030.smartcampus.booking.exception.BookingConflictException;
import lk.sliit.it3030.smartcampus.booking.repository.BookingRepository;
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
                request.getResourceId(), request.getStartTime(), request.getEndTime());

        if (!overlapping.isEmpty()) {
            throw new BookingConflictException("Resource is already booked for the selected time period");
        }

        Booking booking = new Booking();
        booking.setResourceId(request.getResourceId());
        booking.setUserId(userId);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        return convertToDto(saved);
    }

    public List<BookingResponseDto> getMyBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return bookings.stream().map(this::convertToDto).toList();
    }

    private BookingResponseDto convertToDto(Booking booking) {
        BookingResponseDto dto = new BookingResponseDto();
        dto.setId(booking.getId());
        dto.setResourceId(booking.getResourceId());
        dto.setUserId(booking.getUserId());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setExpectedAttendees(booking.getExpectedAttendees());
        dto.setStatus(booking.getStatus());
        dto.setRejectionReason(booking.getRejectionReason());
        dto.setCancellationReason(booking.getCancellationReason());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());
        return dto;
    }

        /**
     * Admin only: Get ALL bookings with optional filters
     */
    public List<BookingResponseDto> getAllBookings(
            BookingStatus status, 
            LocalDateTime startDate, 
            LocalDateTime endDate) {

        List<Booking> bookings;

        if (status != null) {
            bookings = bookingRepository.findByStatus(status);
        } else {
            bookings = bookingRepository.findAll();
        }

        // Optional date filter
        if (startDate != null && endDate != null) {
            bookings = bookings.stream()
                    .filter(b -> !b.getStartTime().isBefore(startDate) && 
                                 !b.getEndTime().isAfter(endDate))
                    .toList();
        }

        return bookings.stream()
                .map(this::convertToDto)
                .toList();
    }

        @Transactional
    public BookingResponseDto approveBooking(Long bookingId, String reason, Long adminId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only PENDING bookings can be approved");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setRejectionReason(null); // clear if any
        booking.setCancellationReason(null);

        Booking updated = bookingRepository.save(booking);
        return convertToDto(updated);
    }

    @Transactional
    public BookingResponseDto rejectBooking(Long bookingId, String reason, Long adminId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only PENDING bookings can be rejected");
        }

        if (reason == null || reason.trim().isEmpty()) {
            throw new RuntimeException("Rejection reason is required");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);

        Booking updated = bookingRepository.save(booking);
        return convertToDto(updated);
    }

        @Transactional
    public BookingResponseDto cancelBooking(Long bookingId, String reason, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Only APPROVED bookings can be cancelled
        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new RuntimeException("Only APPROVED bookings can be cancelled");
        }

        // Optional: Allow only the owner or admin to cancel (for now we allow anyone for simplicity)
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason != null ? reason : "Cancelled by user");

        Booking updated = bookingRepository.save(booking);
        return convertToDto(updated);
    }

}