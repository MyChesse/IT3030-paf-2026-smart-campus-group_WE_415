package lk.sliit.it3030.smartcampus.ticket.service;

import lk.sliit.it3030.smartcampus.ticket.dto.*;
import lk.sliit.it3030.smartcampus.ticket.entity.IncidentTicket;
import lk.sliit.it3030.smartcampus.ticket.entity.TicketAttachment;
import lk.sliit.it3030.smartcampus.ticket.entity.TicketComment;
import lk.sliit.it3030.smartcampus.ticket.entity.TicketStatus;
import lk.sliit.it3030.smartcampus.ticket.exception.CommentNotFoundException;
import lk.sliit.it3030.smartcampus.ticket.exception.FileValidationException;
import lk.sliit.it3030.smartcampus.ticket.exception.ForbiddenActionException;
import lk.sliit.it3030.smartcampus.ticket.exception.InvalidTicketOperationException;
import lk.sliit.it3030.smartcampus.ticket.exception.TicketNotFoundException;
import lk.sliit.it3030.smartcampus.ticket.mapper.TicketMapper;
import lk.sliit.it3030.smartcampus.ticket.repository.IncidentTicketRepository;
import lk.sliit.it3030.smartcampus.ticket.repository.IncidentTicketSpecifications;
import lk.sliit.it3030.smartcampus.ticket.repository.TicketAttachmentRepository;
import lk.sliit.it3030.smartcampus.ticket.repository.TicketCommentRepository;
import lk.sliit.it3030.smartcampus.ticket.security.RequestUser;
import lk.sliit.it3030.smartcampus.ticket.security.UserRole;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class TicketService {

    private final IncidentTicketRepository incidentTicketRepository;
    private final TicketAttachmentRepository ticketAttachmentRepository;
    private final TicketCommentRepository ticketCommentRepository;
    private final TicketAttachmentStorageService attachmentStorageService;
    private final TicketMapper ticketMapper;

    public TicketService(
            IncidentTicketRepository incidentTicketRepository,
            TicketAttachmentRepository ticketAttachmentRepository,
            TicketCommentRepository ticketCommentRepository,
            TicketAttachmentStorageService attachmentStorageService,
            TicketMapper ticketMapper
    ) {
        this.incidentTicketRepository = incidentTicketRepository;
        this.ticketAttachmentRepository = ticketAttachmentRepository;
        this.ticketCommentRepository = ticketCommentRepository;
        this.attachmentStorageService = attachmentStorageService;
        this.ticketMapper = ticketMapper;
    }

    @Transactional
    public TicketResponseDto createTicket(TicketCreateRequestDto request, List<MultipartFile> attachments, RequestUser user) {
        requireRole(user, UserRole.USER, UserRole.ADMIN, UserRole.STAFF);

        List<MultipartFile> safeAttachments = attachments == null ? List.of() : attachments;
        attachmentStorageService.validateAttachments(safeAttachments);

        IncidentTicket ticket = new IncidentTicket();
        ticket.setTitle(request.getTitle().trim());
        ticket.setCategory(request.getCategory().trim());
        ticket.setDescription(request.getDescription().trim());
        ticket.setPriority(request.getPriority());
        ticket.setResourceId(request.getResourceId());
        ticket.setLocation(request.getLocation().trim());
        ticket.setPreferredContactName(request.getPreferredContactName().trim());
        ticket.setPreferredContactEmail(request.getPreferredContactEmail().trim());
        ticket.setPreferredContactPhone(request.getPreferredContactPhone() == null ? null : request.getPreferredContactPhone().trim());
        ticket.setCreatedByUserId(user.userId());
        ticket.setCreatedByUserRole(user.role());
        ticket.setStatus(TicketStatus.OPEN);

        IncidentTicket saved = incidentTicketRepository.save(ticket);
        saved.setTicketCode(generateTicketCode(saved.getId()));
        saved = incidentTicketRepository.save(saved);

        List<TicketAttachment> attachmentEntities = new ArrayList<>();
        for (MultipartFile file : safeAttachments) {
            TicketAttachmentStorageService.StoredFileDetails stored = attachmentStorageService.storeFile(file);
            TicketAttachment attachment = new TicketAttachment();
            attachment.setOriginalFileName(stored.originalFileName());
            attachment.setStoredFileName(stored.storedFileName());
            attachment.setFileType(stored.fileType());
            attachment.setFilePath(stored.filePath());
            attachment.setFileSize(stored.fileSize());
            attachment.setTicket(saved);
            attachmentEntities.add(ticketAttachmentRepository.save(attachment));
        }

        return ticketMapper.toResponse(saved, attachmentEntities, List.of(), user);
    }

    public List<TicketResponseDto> getMyTickets(RequestUser user) {
        return incidentTicketRepository.findByCreatedByUserIdOrderByCreatedAtDesc(user.userId())
                .stream()
                .map(ticketMapper::toSummary)
                .toList();
    }

    public List<TicketResponseDto> getTickets(TicketListFiltersDto filters, RequestUser user) {
        requireRole(user, UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.STAFF);

        if (user.role() == UserRole.TECHNICIAN && filters.getAssignedTechnicianId() == null) {
            filters.setAssignedTechnicianId(user.userId());
        }

        Specification<IncidentTicket> spec = IncidentTicketSpecifications.withFilters(filters);

        return incidentTicketRepository.findAll(spec)
                .stream()
                .map(ticketMapper::toSummary)
                .toList();
    }

    public TicketResponseDto getTicketById(Long ticketId, RequestUser user) {
        IncidentTicket ticket = findTicket(ticketId);
        ensureTicketAccess(ticket, user);

        List<TicketAttachment> attachments = ticketAttachmentRepository.findByTicketId(ticketId);
        List<TicketComment> comments = ticketCommentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
        return ticketMapper.toResponse(ticket, attachments, comments, user);
    }

    @Transactional
    public TicketResponseDto assignTechnician(Long ticketId, TicketAssignRequestDto request, RequestUser user) {
        requireRole(user, UserRole.ADMIN, UserRole.STAFF);

        IncidentTicket ticket = findTicket(ticketId);
        ticket.setAssignedTechnicianId(request.getAssignedTechnicianId());
        ticket.setAssignedTechnicianName(request.getAssignedTechnicianName().trim());

        IncidentTicket saved = incidentTicketRepository.save(ticket);
        return ticketMapper.toSummary(saved);
    }

    @Transactional
    public TicketResponseDto updateStatus(Long ticketId, TicketStatusUpdateRequestDto request, RequestUser user) {
        IncidentTicket ticket = findTicket(ticketId);
        ensureStatusUpdatePermission(ticket, user);

        validateStatusTransition(ticket, request);
        ticket.setStatus(request.getStatus());

        if (request.getStatus() == TicketStatus.REJECTED) {
            ticket.setRejectionReason(request.getRejectionReason().trim());
        }

        if (request.getStatus() == TicketStatus.RESOLVED || request.getStatus() == TicketStatus.CLOSED) {
            ticket.setResolutionNotes(request.getResolutionNotes().trim());
        }

        if (request.getStatus() != TicketStatus.REJECTED) {
            ticket.setRejectionReason(null);
        }

        IncidentTicket saved = incidentTicketRepository.save(ticket);
        return ticketMapper.toSummary(saved);
    }

    @Transactional
    public TicketResponseDto updateResolutionNotes(Long ticketId, TicketResolutionUpdateRequestDto request, RequestUser user) {
        IncidentTicket ticket = findTicket(ticketId);
        ensureStatusUpdatePermission(ticket, user);

        ticket.setResolutionNotes(request.getResolutionNotes().trim());
        IncidentTicket saved = incidentTicketRepository.save(ticket);
        return ticketMapper.toSummary(saved);
    }

    @Transactional
    public TicketCommentResponseDto addComment(Long ticketId, TicketCommentCreateRequestDto request, RequestUser user) {
        IncidentTicket ticket = findTicket(ticketId);
        ensureTicketAccess(ticket, user);

        TicketComment comment = new TicketComment();
        comment.setTicket(ticket);
        comment.setCommentText(request.getCommentText().trim());
        comment.setAuthorId(user.userId());
        comment.setAuthorRole(user.role());
        comment.setAuthorName(user.displayName());

        TicketComment saved = ticketCommentRepository.save(comment);
        return new TicketCommentResponseDto(
                saved.getId(),
                saved.getCommentText(),
                saved.getAuthorId(),
                saved.getAuthorRole(),
                saved.getAuthorName(),
                saved.getCreatedAt(),
                saved.getUpdatedAt(),
                true
        );
    }

    @Transactional
    public TicketCommentResponseDto updateComment(Long commentId, TicketCommentUpdateRequestDto request, RequestUser user) {
        TicketComment comment = ticketCommentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException("Comment not found"));

        boolean canEdit = comment.getAuthorId().equals(user.userId()) || user.isAdminLike();
        if (!canEdit) {
            throw new ForbiddenActionException("You can only edit your own comments");
        }

        comment.setCommentText(request.getCommentText().trim());
        TicketComment saved = ticketCommentRepository.save(comment);

        return new TicketCommentResponseDto(
                saved.getId(),
                saved.getCommentText(),
                saved.getAuthorId(),
                saved.getAuthorRole(),
                saved.getAuthorName(),
                saved.getCreatedAt(),
                saved.getUpdatedAt(),
                true
        );
    }

    @Transactional
    public void deleteComment(Long commentId, RequestUser user) {
        TicketComment comment = ticketCommentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException("Comment not found"));

        boolean canDelete = comment.getAuthorId().equals(user.userId()) || user.isAdminLike();
        if (!canDelete) {
            throw new ForbiddenActionException("You can only delete your own comments");
        }

        ticketCommentRepository.delete(comment);
    }

    @Transactional
    public void deleteAttachment(Long ticketId, Long attachmentId, RequestUser user) {
        IncidentTicket ticket = findTicket(ticketId);

        boolean isOwner = ticket.getCreatedByUserId().equals(user.userId());
        boolean isAdmin = user.isAdminLike();
        if (!isOwner && !isAdmin) {
            throw new ForbiddenActionException("Only ticket owner or admin/staff can delete attachments");
        }

        TicketAttachment attachment = ticketAttachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new TicketNotFoundException("Attachment not found"));

        if (!attachment.getTicket().getId().equals(ticketId)) {
            throw new InvalidTicketOperationException("Attachment does not belong to this ticket");
        }

        ticketAttachmentRepository.delete(attachment);
        attachmentStorageService.deleteFileIfExists(attachment.getFilePath());
    }

    private IncidentTicket findTicket(Long ticketId) {
        return incidentTicketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found"));
    }

    private void ensureTicketAccess(IncidentTicket ticket, RequestUser user) {
        boolean isOwner = ticket.getCreatedByUserId().equals(user.userId());
        boolean isAdminLike = user.isAdminLike();
        boolean isAssignedTech = user.role() == UserRole.TECHNICIAN && ticket.getAssignedTechnicianId() != null
                && ticket.getAssignedTechnicianId().equals(user.userId());

        if (!isOwner && !isAdminLike && !isAssignedTech) {
            throw new ForbiddenActionException("You do not have permission to access this ticket");
        }
    }

    private void ensureStatusUpdatePermission(IncidentTicket ticket, RequestUser user) {
        boolean adminLike = user.isAdminLike();
        boolean assignedTechnician = user.role() == UserRole.TECHNICIAN && ticket.getAssignedTechnicianId() != null
                && ticket.getAssignedTechnicianId().equals(user.userId());

        if (!adminLike && !assignedTechnician) {
            throw new ForbiddenActionException("Only admin/staff or assigned technician can update this ticket");
        }
    }

    private void validateStatusTransition(IncidentTicket ticket, TicketStatusUpdateRequestDto request) {
        TicketStatus current = ticket.getStatus();
        TicketStatus next = request.getStatus();

        boolean validTransition =
                (current == TicketStatus.OPEN && (next == TicketStatus.IN_PROGRESS || next == TicketStatus.REJECTED)) ||
                (current == TicketStatus.IN_PROGRESS && (next == TicketStatus.RESOLVED || next == TicketStatus.REJECTED)) ||
                (current == TicketStatus.RESOLVED && next == TicketStatus.CLOSED);

        if (!validTransition) {
            throw new InvalidTicketOperationException("Invalid status transition from " + current + " to " + next);
        }

        if (next == TicketStatus.IN_PROGRESS && ticket.getAssignedTechnicianId() == null) {
            throw new InvalidTicketOperationException("Technician must be assigned before setting status to IN_PROGRESS");
        }

        if (next == TicketStatus.REJECTED && (request.getRejectionReason() == null || request.getRejectionReason().trim().isEmpty())) {
            throw new InvalidTicketOperationException("Rejection reason is required when rejecting a ticket");
        }

        if ((next == TicketStatus.RESOLVED || next == TicketStatus.CLOSED)
                && (request.getResolutionNotes() == null || request.getResolutionNotes().trim().isEmpty())) {
            throw new InvalidTicketOperationException("Resolution notes are required for RESOLVED/CLOSED status");
        }
    }

    private void requireRole(RequestUser user, UserRole... allowed) {
        for (UserRole role : allowed) {
            if (user.role() == role) {
                return;
            }
        }
        throw new ForbiddenActionException("Role " + user.role() + " is not allowed for this action");
    }

    private String generateTicketCode(Long id) {
        return String.format("TCK-%04d", id);
    }
}
