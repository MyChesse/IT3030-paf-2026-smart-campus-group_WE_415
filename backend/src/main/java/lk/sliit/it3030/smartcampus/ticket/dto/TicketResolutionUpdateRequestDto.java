package lk.sliit.it3030.smartcampus.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketResolutionUpdateRequestDto {

    @NotBlank(message = "Resolution notes are required")
    @Size(min = 10, max = 2000, message = "Resolution notes must be between 10 and 2000 characters")
    private String resolutionNotes;
}
