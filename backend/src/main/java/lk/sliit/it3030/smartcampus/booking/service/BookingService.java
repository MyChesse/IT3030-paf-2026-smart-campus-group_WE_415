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
        // 1. Check for overlapping bookings (conflict prevention)
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                request.getResourceId(), 
                request.getStartTime(), 
                request.getEndTime()
        );

        if (!overlapping.isEmpty()) {
            throw new BookingConflictException("Resource is already booked for the selected time period");
        }

        // 2. Create new booking
        Booking booking = new Booking();
        booking.setResourceId(request.getResourceId());
        booking.setUserId(userId);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);

        // Convert to Response DTO
        return convertToResponseDto(savedBooking);
    }

    /**
     * Get all bookings for the current user
     */
    public List<BookingResponseDto> getMyBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return bookings.stream()
                .map(this::convertToResponseDto)
                .toList();
    }

    private BookingResponseDto convertToResponseDto(Booking booking) {
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

        // Simple date filter if provided
        if (startDate != null && endDate != null) {
            bookings = bookings.stream()
                    .filter(b -> !b.getStartTime().isBefore(startDate) && 
                                 !b.getEndTime().isAfter(endDate))
                    .toList();
        }

        return bookings.stream()
                .map(this::convertToResponseDto)
                .toList();
    }

}