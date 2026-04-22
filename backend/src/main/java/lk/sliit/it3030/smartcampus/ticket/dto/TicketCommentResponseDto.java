package lk.sliit.it3030.smartcampus.ticket.dto;

import lk.sliit.it3030.smartcampus.ticket.security.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketCommentResponseDto {
    private Long id;
    private String commentText;
    private Long authorId;
    private UserRole authorRole;
    private String authorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean editableByCurrentUser;
}
