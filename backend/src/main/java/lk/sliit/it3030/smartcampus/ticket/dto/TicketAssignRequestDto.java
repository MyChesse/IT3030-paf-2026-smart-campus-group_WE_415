package lk.sliit.it3030.smartcampus.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketAssignRequestDto {

    @NotNull(message = "Assigned technician ID is required")
    private Long assignedTechnicianId;

    @NotBlank(message = "Assigned technician name is required")
    @Size(max = 120, message = "Assigned technician name must be at most 120 characters")
    private String assignedTechnicianName;
}
