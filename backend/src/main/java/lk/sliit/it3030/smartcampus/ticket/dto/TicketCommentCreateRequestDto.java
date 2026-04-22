package lk.sliit.it3030.smartcampus.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketCommentCreateRequestDto {

    @NotBlank(message = "Comment text is required")
    @Size(min = 1, max = 1000, message = "Comment text must be between 1 and 1000 characters")
    private String commentText;
}
