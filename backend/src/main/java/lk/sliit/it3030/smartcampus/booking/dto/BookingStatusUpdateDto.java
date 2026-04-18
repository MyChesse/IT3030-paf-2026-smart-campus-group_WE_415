package lk.sliit.it3030.smartcampus.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingStatusUpdateDto {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotBlank(message = "Reason is required for approve/reject")
    private String reason;
}