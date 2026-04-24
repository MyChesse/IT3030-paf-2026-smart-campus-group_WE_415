package lk.sliit.it3030.smartcampus.ticket.dto;

import jakarta.validation.constraints.NotNull;
import lk.sliit.it3030.smartcampus.ticket.entity.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketStatusUpdateRequestDto {

    @NotNull(message = "Status is required")
    private TicketStatus status;

    private String rejectionReason;

    private String resolutionNotes;
}
