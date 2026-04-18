package lk.sliit.it3030.smartcampus.booking;

import lk.sliit.it3030.smartcampus.booking.dto.BookingCreateRequestDto;
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

    private BookingCreateRequestDto requestDto;
    private Booking existingBooking;

    @BeforeEach
    void setUp() {
        requestDto = new BookingCreateRequestDto();
        requestDto.setResourceId(101L);
        requestDto.setStartTime(LocalDateTime.of(2026, 4, 25, 10, 0));
        requestDto.setEndTime(LocalDateTime.of(2026, 4, 25, 11, 30));
        requestDto.setPurpose("Test Lecture");
        requestDto.setExpectedAttendees(30);

        existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setResourceId(101L);
        existingBooking.setStartTime(LocalDateTime.of(2026, 4, 25, 9, 0));
        existingBooking.setEndTime(LocalDateTime.of(2026, 4, 25, 10, 30));
        existingBooking.setStatus(BookingStatus.APPROVED);
    }

    @Test
    void createBooking_ShouldThrowException_WhenTimeOverlaps() {
        when(bookingRepository.findOverlappingBookings(any(), any(), any()))
                .thenReturn(List.of(existingBooking));

        assertThrows(BookingConflictException.class, () -> 
            bookingService.createBooking(requestDto, 1L));
    }

    @Test
    void createBooking_ShouldSaveBooking_WhenNoOverlap() {
        when(bookingRepository.findOverlappingBookings(any(), any(), any()))
                .thenReturn(Collections.emptyList());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> i.getArgument(0));

        BookingResponseDto result = bookingService.createBooking(requestDto, 1L);

        assertNotNull(result);
        assertEquals(BookingStatus.PENDING, result.getStatus());
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    void getMyBookings_ShouldReturnUserBookings() {
        when(bookingRepository.findByUserId(1L)).thenReturn(List.of(existingBooking));

        List<BookingResponseDto> result = bookingService.getMyBookings(1L);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }
}