package lk.sliit.it3030.smartcampus.ticket.controller;

import jakarta.validation.Valid;
import lk.sliit.it3030.smartcampus.ticket.dto.*;
import lk.sliit.it3030.smartcampus.ticket.entity.TicketPriority;
import lk.sliit.it3030.smartcampus.ticket.entity.TicketStatus;
import lk.sliit.it3030.smartcampus.ticket.security.RequestUser;
import lk.sliit.it3030.smartcampus.ticket.security.RequestUserResolver;
import lk.sliit.it3030.smartcampus.ticket.service.TicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;
    private final RequestUserResolver requestUserResolver;

    public TicketController(TicketService ticketService, RequestUserResolver requestUserResolver) {
        this.ticketService = ticketService;
        this.requestUserResolver = requestUserResolver;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketResponseDto> createTicket(
            @RequestPart("ticket") @Valid TicketCreateRequestDto request,
            @RequestPart(value = "attachments", required = false) List<MultipartFile> attachments,
            @RequestHeader(value = RequestUserResolver.USER_ID_HEADER, required = false) String userIdHeader,
            @RequestHeader(value = RequestUserResolver.USER_ROLE_HEADER, required = false) String userRoleHeader,
            @RequestHeader(value = RequestUserResolver.USER_NAME_HEADER, required = false) String userNameHeader
    ) {
        RequestUser user = requestUserResolver.resolve(userIdHeader, userRoleHeader, userNameHeader);
        TicketResponseDto response = ticketService.createTicket(request, attachments, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<TicketResponseDto>> getMyTickets(
            @RequestHeader(value = RequestUserResolver.USER_ID_HEADER, required = false) String userIdHeader,
            @RequestHeader(value = RequestUserResolver.USER_ROLE_HEADER, required = false) String userRoleHeader,
            @RequestHeader(value = RequestUserResolver.USER_NAME_HEADER, required = false) String userNameHeader
    ) {
        RequestUser user = requestUserResolver.resolve(userIdHeader, userRoleHeader, userNameHeader);
        return ResponseEntity.ok(ticketService.getMyTickets(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDto> getTicketById(
            @PathVariable Long id,
            @RequestHeader(value = RequestUserResolver.USER_ID_HEADER, required = false) String userIdHeader,
            @RequestHeader(value = RequestUserResolver.USER_ROLE_HEADER, required = false) String userRoleHeader,
            @RequestHeader(value = RequestUserResolver.USER_NAME_HEADER, required = false) String userNameHeader
    ) {
        RequestUser user = requestUserResolver.resolve(userIdHeader, userRoleHeader, userNameHeader);
        return ResponseEntity.ok(ticketService.getTicketById(id, user));
    }

    @GetMapping
    public ResponseEntity<List<TicketResponseDto>> getTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketPriority priority,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Long assignedTechnician,
            @RequestParam(required = false) String search,
            @RequestHeader(value = RequestUserResolver.USER_ID_HEADER, required = false) String userIdHeader,
            @RequestHeader(value = RequestUserResolver.USER_ROLE_HEADER, required = false) String userRoleHeader,
            @RequestHeader(value = RequestUserResolver.USER_NAME_HEADER, required = false) String userNameHeader
    ) {
        RequestUser user = requestUserResolver.resolve(userIdHeader, userRoleHeader, userNameHeader);
        TicketListFiltersDto filters = new TicketListFiltersDto(status, priority, category, assignedTechnician, search);
        return ResponseEntity.ok(ticketService.getTickets(filters, user));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<TicketResponseDto> assignTechnician(
            @PathVariable Long id,
            @RequestBody @Valid TicketAssignRequestDto request,
            @RequestHeader(value = RequestUserResolver.USER_ID_HEADER, required = false) String userIdHeader,
            @RequestHeader(value = RequestUserResolver.USER_ROLE_HEADER, required = false) String userRoleHeader,
            @RequestHeader(value = RequestUserResolver.USER_NAME_HEADER, required = false) String userNameHeader
    ) {
        RequestUser user = requestUserResolver.resolve(userIdHeader, userRoleHeader, userNameHeader);
        return ResponseEntity.ok(ticketService.assignTechnician(id, request, user));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestBody @Valid TicketStatusUpdateRequestDto request,
            @RequestHeader(value = RequestUserResolver.USER_ID_HEADER, required = false) String userIdHeader,
            @RequestHeader(value = RequestUserResolver.USER_ROLE_HEADER, required = false) String userRoleHeader,
            @RequestHeader(value = RequestUserResolver.USER_NAME_HEADER, required = false) String userNameHeader
    ) {
        RequestUser user = requestUserResolver.resolve(userIdHeader, userRoleHeader, userNameHeader);
        return ResponseEntity.ok(ticketService.updateStatus(id, request, user));
    }

    @PatchMapping("/{id}/resolution")
    public ResponseEntity<TicketResponseDto> updateResolution(
            @PathVariable Long id,
            @RequestBody @Valid TicketResolutionUpdateRequestDto request,
            @RequestHeader(value = RequestUserResolver.USER_ID_HEADER, required = false) String userIdHeader,
            @RequestHeader(value = RequestUserResolver.USER_ROLE_HEADER, required = false) String userRoleHeader,
            @RequestHeader(value = RequestUserResolver.USER_NAME_HEADER, required = false) String userNameHeader
    ) {
        RequestUser user = requestUserResolver.resolve(userIdHeader, userRoleHeader, userNameHeader);
        return ResponseEntity.ok(ticketService.updateResolutionNotes(id, request, user));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketCommentResponseDto> addComment(
            @PathVariable Long id,
            @RequestBody @Valid TicketCommentCreateRequestDto request,
            @RequestHeader(value = RequestUserResolver.USER_ID_HEADER, required = false) String userIdHeader,
            @RequestHeader(value = RequestUserResolver.USER_ROLE_HEADER, required = false) String userRoleHeader,
            @RequestHeader(value = RequestUserResolver.USER_NAME_HEADER, required = false) String userNameHeader
    ) {
        RequestUser user = requestUserResolver.resolve(userIdHeader, userRoleHeader, userNameHeader);
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.addComment(id, request, user));
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<TicketCommentResponseDto> updateComment(
            @PathVariable Long commentId,
            @RequestBody @Valid TicketCommentUpdateRequestDto request,
            @RequestHeader(value = RequestUserResolver.USER_ID_HEADER, required = false) String userIdHeader,
            @RequestHeader(value = RequestUserResolver.USER_ROLE_HEADER, required = false) String userRoleHeader,
            @RequestHeader(value = RequestUserResolver.USER_NAME_HEADER, required = false) String userNameHeader
    ) {
        RequestUser user = requestUserResolver.resolve(userIdHeader, userRoleHeader, userNameHeader);
        return ResponseEntity.ok(ticketService.updateComment(commentId, request, user));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @RequestHeader(value = RequestUserResolver.USER_ID_HEADER, required = false) String userIdHeader,
            @RequestHeader(value = RequestUserResolver.USER_ROLE_HEADER, required = false) String userRoleHeader,
            @RequestHeader(value = RequestUserResolver.USER_NAME_HEADER, required = false) String userNameHeader
    ) {
        RequestUser user = requestUserResolver.resolve(userIdHeader, userRoleHeader, userNameHeader);
        ticketService.deleteComment(commentId, user);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{ticketId}/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(
            @PathVariable Long ticketId,
            @PathVariable Long attachmentId,
            @RequestHeader(value = RequestUserResolver.USER_ID_HEADER, required = false) String userIdHeader,
            @RequestHeader(value = RequestUserResolver.USER_ROLE_HEADER, required = false) String userRoleHeader,
            @RequestHeader(value = RequestUserResolver.USER_NAME_HEADER, required = false) String userNameHeader
    ) {
        RequestUser user = requestUserResolver.resolve(userIdHeader, userRoleHeader, userNameHeader);
        ticketService.deleteAttachment(ticketId, attachmentId, user);
        return ResponseEntity.noContent().build();
    }
}
