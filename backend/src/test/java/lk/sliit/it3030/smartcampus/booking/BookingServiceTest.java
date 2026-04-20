package lk.sliit.it3030.smartcampus.booking;

import lk.sliit.it3030.smartcampus.booking.dto.BookingCreateRequestDto;
import lk.sliit.it3030.smartcampus.booking.dto.BookingResponseDto;
import lk.sliit.it3030.smartcampus.booking.entity.Booking;
import lk.sliit.it3030.smartcampus.booking.entity.BookingStatus;
import lk.sliit.it3030.smartcampus.booking.exception.BookingConflictException;
import lk.sliit.it3030.smartcampus.booking.repository.BookingRepository;
import lk.sliit.it3030.smartcampus.booking.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private BookingService bookingService;

    private BookingCreateRequestDto validRequest;
    private Booking existingBooking;

    @BeforeEach
    void setUp() {
        validRequest = new BookingCreateRequestDto();
        validRequest.setResourceId(101L);
        validRequest.setStartTime(LocalDateTime.of(2026, 4, 25, 14, 0));
        validRequest.setEndTime(LocalDateTime.of(2026, 4, 25, 15, 30));
        validRequest.setPurpose("Test Booking");
        validRequest.setExpectedAttendees(25);

        existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setResourceId(101L);
        existingBooking.setStartTime(LocalDateTime.of(2026, 4, 25, 13, 0));
        existingBooking.setEndTime(LocalDateTime.of(2026, 4, 25, 14, 30));
        existingBooking.setStatus(BookingStatus.APPROVED);
    }

    @Test
    void createBooking_ShouldThrowException_WhenTimeOverlaps() {
        when(bookingRepository.findOverlappingBookings(any(), any(), any()))
                .thenReturn(List.of(existingBooking));

        assertThrows(BookingConflictException.class, () -> 
            bookingService.createBooking(validRequest, 1L));
    }

    @Test
    void createBooking_ShouldSaveSuccessfully_WhenNoOverlap() {
        when(bookingRepository.findOverlappingBookings(any(), any(), any()))
                .thenReturn(Collections.emptyList());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> {
            Booking b = i.getArgument(0);
            b.setId(10L);
            return b;
        });

        BookingResponseDto result = bookingService.createBooking(validRequest, 1L);

        assertNotNull(result);
        assertEquals(BookingStatus.PENDING, result.getStatus());
        assertEquals("Test Booking", result.getPurpose());
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    void getMyBookings_ShouldReturnCorrectBookings() {
        when(bookingRepository.findByUserId(1L)).thenReturn(List.of(existingBooking));

        List<BookingResponseDto> result = bookingService.getMyBookings(1L);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(BookingStatus.APPROVED, result.get(0).getStatus());
    }

    @Test
    void approveBooking_ShouldChangeStatusToApproved() {
        Booking pendingBooking = new Booking();
        pendingBooking.setId(2L);
        pendingBooking.setStatus(BookingStatus.PENDING);

        when(bookingRepository.findById(2L)).thenReturn(Optional.of(pendingBooking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> i.getArgument(0));

        BookingResponseDto result = bookingService.approveBooking(2L, "Approved for lecture", 999L);

        assertEquals(BookingStatus.APPROVED, result.getStatus());
    }
}