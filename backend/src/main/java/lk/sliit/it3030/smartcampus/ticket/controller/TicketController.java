package lk.sliit.it3030.smartcampus.ticket.controller;

import jakarta.validation.Valid;
import com.campus.auth.entity.AppUser;
import com.campus.auth.service.AuthService;
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
    private final AuthService authService;

    public TicketController(TicketService ticketService, RequestUserResolver requestUserResolver, AuthService authService) {
        this.ticketService = ticketService;
        this.requestUserResolver = requestUserResolver;
        this.authService = authService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketResponseDto> createTicket(
            @RequestPart("ticket") @Valid TicketCreateRequestDto request,
            @RequestPart(value = "attachments", required = false) List<MultipartFile> attachments,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        RequestUser user = resolveAuthenticatedUser(authHeader, fallbackUserId);
        TicketResponseDto response = ticketService.createTicket(request, attachments, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<TicketResponseDto>> getMyTickets(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        RequestUser user = resolveAuthenticatedUser(authHeader, fallbackUserId);
        return ResponseEntity.ok(ticketService.getMyTickets(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDto> getTicketById(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        RequestUser user = resolveAuthenticatedUser(authHeader, fallbackUserId);
        return ResponseEntity.ok(ticketService.getTicketById(id, user));
    }

    @GetMapping
    public ResponseEntity<List<TicketResponseDto>> getTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketPriority priority,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Long assignedTechnician,
            @RequestParam(required = false) String search,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        RequestUser user = resolveAuthenticatedUser(authHeader, fallbackUserId);
        TicketListFiltersDto filters = new TicketListFiltersDto(status, priority, category, assignedTechnician, search);
        return ResponseEntity.ok(ticketService.getTickets(filters, user));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<TicketResponseDto> assignTechnician(
            @PathVariable Long id,
            @RequestBody @Valid TicketAssignRequestDto request,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        RequestUser user = resolveAuthenticatedUser(authHeader, fallbackUserId);
        return ResponseEntity.ok(ticketService.assignTechnician(id, request, user));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestBody @Valid TicketStatusUpdateRequestDto request,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        RequestUser user = resolveAuthenticatedUser(authHeader, fallbackUserId);
        return ResponseEntity.ok(ticketService.updateStatus(id, request, user));
    }

    @PatchMapping("/{id}/resolution")
    public ResponseEntity<TicketResponseDto> updateResolution(
            @PathVariable Long id,
            @RequestBody @Valid TicketResolutionUpdateRequestDto request,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        RequestUser user = resolveAuthenticatedUser(authHeader, fallbackUserId);
        return ResponseEntity.ok(ticketService.updateResolutionNotes(id, request, user));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketCommentResponseDto> addComment(
            @PathVariable Long id,
            @RequestBody @Valid TicketCommentCreateRequestDto request,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        RequestUser user = resolveAuthenticatedUser(authHeader, fallbackUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.addComment(id, request, user));
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<TicketCommentResponseDto> updateComment(
            @PathVariable Long commentId,
            @RequestBody @Valid TicketCommentUpdateRequestDto request,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        RequestUser user = resolveAuthenticatedUser(authHeader, fallbackUserId);
        return ResponseEntity.ok(ticketService.updateComment(commentId, request, user));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        RequestUser user = resolveAuthenticatedUser(authHeader, fallbackUserId);
        ticketService.deleteComment(commentId, user);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{ticketId}/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(
            @PathVariable Long ticketId,
            @PathVariable Long attachmentId,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-User-Id", required = false) String fallbackUserId
    ) {
        RequestUser user = resolveAuthenticatedUser(authHeader, fallbackUserId);
        ticketService.deleteAttachment(ticketId, attachmentId, user);
        return ResponseEntity.noContent().build();
    }

    private RequestUser resolveAuthenticatedUser(String authHeader, String fallbackUserId) {
        AppUser appUser = authService.getCurrentUser(authHeader, fallbackUserId);
        return requestUserResolver.resolveAuthenticated(appUser.getId(), appUser.getRoles(), appUser.getName());
    }
}
