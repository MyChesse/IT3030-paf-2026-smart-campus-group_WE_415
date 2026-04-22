package lk.sliit.it3030.smartcampus.ticket.dto;

import lk.sliit.it3030.smartcampus.ticket.entity.TicketPriority;
import lk.sliit.it3030.smartcampus.ticket.entity.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponseDto {
    private Long id;
    private String ticketCode;
    private String title;
    private String category;
    private String description;
    private TicketPriority priority;
    private Long resourceId;
    private String location;
    private String preferredContactName;
    private String preferredContactEmail;
    private String preferredContactPhone;
    private TicketStatus status;
    private String rejectionReason;
    private String resolutionNotes;
    private Long createdByUserId;
    private Long assignedTechnicianId;
    private String assignedTechnicianName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TicketAttachmentResponseDto> attachments;
    private List<TicketCommentResponseDto> comments;
}
