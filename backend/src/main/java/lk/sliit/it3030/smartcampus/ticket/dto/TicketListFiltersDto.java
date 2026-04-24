package lk.sliit.it3030.smartcampus.ticket.dto;

import lk.sliit.it3030.smartcampus.ticket.entity.TicketPriority;
import lk.sliit.it3030.smartcampus.ticket.entity.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketListFiltersDto {
    private TicketStatus status;
    private TicketPriority priority;
    private String category;
    private Long assignedTechnicianId;
    private String search;
}
