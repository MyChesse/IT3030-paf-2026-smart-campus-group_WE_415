package com.campus.booking.dto;

import com.campus.booking.entity.BookingStatus;

import java.time.LocalDateTime;

public record BookingResponseDto(
        Long id,
        Long resourceId,
        Long userId,
        LocalDateTime startTime,
        LocalDateTime endTime,
        String purpose,
        Integer expectedAttendees,
        BookingStatus status,
        String rejectionReason,
        String cancellationReason,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
        ) {

}
