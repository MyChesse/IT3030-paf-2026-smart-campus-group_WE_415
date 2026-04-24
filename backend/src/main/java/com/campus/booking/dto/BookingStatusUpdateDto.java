package com.campus.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BookingStatusUpdateDto(
        @NotNull(message = "Booking ID is required")
        Long bookingId,
        @NotBlank(message = "Reason is required for approve/reject")
        String reason
        ) {

}
