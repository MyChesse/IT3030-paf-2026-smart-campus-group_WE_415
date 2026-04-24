package lk.sliit.it3030.smartcampus.ticket.dto;

import jakarta.validation.constraints.*;
import lk.sliit.it3030.smartcampus.ticket.entity.TicketPriority;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketCreateRequestDto {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must be at most 150 characters")
    private String title;

    @NotBlank(message = "Category is required")
    @Size(max = 80, message = "Category must be at most 80 characters")
    private String category;

    @NotBlank(message = "Description is required")
    @Size(min = 15, max = 2000, message = "Description must be between 15 and 2000 characters")
    private String description;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    private Long resourceId;

    @NotBlank(message = "Location is required")
    @Size(max = 200, message = "Location must be at most 200 characters")
    private String location;

    @NotBlank(message = "Preferred contact name is required")
    @Size(max = 120, message = "Preferred contact name must be at most 120 characters")
    private String preferredContactName;

    @NotBlank(message = "Preferred contact email is required")
    @Email(message = "Preferred contact email must be valid")
    @Size(max = 120, message = "Preferred contact email must be at most 120 characters")
    private String preferredContactEmail;

    @Pattern(
            regexp = "^$|^[+0-9()\\-\\s]{7,20}$",
            message = "Preferred contact phone must be between 7 and 20 characters and contain valid phone symbols"
    )
    private String preferredContactPhone;
}
