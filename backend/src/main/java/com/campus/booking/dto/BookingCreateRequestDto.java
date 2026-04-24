package com.campus.booking.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record BookingCreateRequestDto(
        @NotNull(message = "Resource ID is required")
        Long resourceId,
        @NotNull(message = "Start time is required")
        @Future(message = "Start time must be in the future")
        LocalDateTime startTime,
        @NotNull(message = "End time is required")
        @Future(message = "End time must be in the future")
        LocalDateTime endTime,
        @NotBlank(message = "Purpose is required")
        @Size(max = 500)
        String purpose,
        @Min(value = 1, message = "Expected attendees must be at least 1")
        Integer expectedAttendees
        ) {

}
