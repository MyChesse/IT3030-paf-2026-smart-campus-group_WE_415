package lk.sliit.it3030.smartcampus.ticket.mapper;

import lk.sliit.it3030.smartcampus.ticket.dto.TicketAttachmentResponseDto;
import lk.sliit.it3030.smartcampus.ticket.dto.TicketCommentResponseDto;
import lk.sliit.it3030.smartcampus.ticket.dto.TicketResponseDto;
import lk.sliit.it3030.smartcampus.ticket.entity.IncidentTicket;
import lk.sliit.it3030.smartcampus.ticket.entity.TicketAttachment;
import lk.sliit.it3030.smartcampus.ticket.entity.TicketComment;
import lk.sliit.it3030.smartcampus.ticket.security.RequestUser;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TicketMapper {

    public TicketResponseDto toResponse(IncidentTicket ticket, List<TicketAttachment> attachments, List<TicketComment> comments, RequestUser currentUser) {
        return new TicketResponseDto(
                ticket.getId(),
                ticket.getTicketCode(),
                ticket.getTitle(),
                ticket.getCategory(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getResourceId(),
                ticket.getLocation(),
                ticket.getPreferredContactName(),
                ticket.getPreferredContactEmail(),
                ticket.getPreferredContactPhone(),
                ticket.getStatus(),
                ticket.getRejectionReason(),
                ticket.getResolutionNotes(),
                ticket.getCreatedByUserId(),
                ticket.getAssignedTechnicianId(),
                ticket.getAssignedTechnicianName(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                attachments.stream().map(this::toAttachmentDto).toList(),
                comments.stream().map(comment -> toCommentDto(comment, currentUser)).toList()
        );
    }

    public TicketResponseDto toSummary(IncidentTicket ticket) {
        return new TicketResponseDto(
                ticket.getId(),
                ticket.getTicketCode(),
                ticket.getTitle(),
                ticket.getCategory(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getResourceId(),
                ticket.getLocation(),
                ticket.getPreferredContactName(),
                ticket.getPreferredContactEmail(),
                ticket.getPreferredContactPhone(),
                ticket.getStatus(),
                ticket.getRejectionReason(),
                ticket.getResolutionNotes(),
                ticket.getCreatedByUserId(),
                ticket.getAssignedTechnicianId(),
                ticket.getAssignedTechnicianName(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                List.of(),
                List.of()
        );
    }

    private TicketAttachmentResponseDto toAttachmentDto(TicketAttachment attachment) {
        return new TicketAttachmentResponseDto(
                attachment.getId(),
                attachment.getOriginalFileName(),
                attachment.getFileType(),
                attachment.getFileSize()
        );
    }

    private TicketCommentResponseDto toCommentDto(TicketComment comment, RequestUser currentUser) {
        boolean editable = comment.getAuthorId().equals(currentUser.userId()) || currentUser.isAdminLike();
        return new TicketCommentResponseDto(
                comment.getId(),
                comment.getCommentText(),
                comment.getAuthorId(),
                comment.getAuthorRole(),
                comment.getAuthorName(),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                editable
        );
    }
}
