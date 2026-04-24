package lk.sliit.it3030.smartcampus.ticket.entity;

import jakarta.persistence.*;
import lk.sliit.it3030.smartcampus.ticket.security.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "incident_tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String ticketCode;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 80)
    private String category;

    @Column(nullable = false, length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketPriority priority;

    @Column
    private Long resourceId;

    @Column(nullable = false, length = 200)
    private String location;

    @Column(nullable = false, length = 120)
    private String preferredContactName;

    @Column(nullable = false, length = 120)
    private String preferredContactEmail;

    @Column(length = 30)
    private String preferredContactPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status = TicketStatus.OPEN;

    @Column(length = 1000)
    private String rejectionReason;

    @Column(length = 2000)
    private String resolutionNotes;

    @Column(nullable = false)
    private Long createdByUserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole createdByUserRole;

    @Column
    private Long assignedTechnicianId;

    @Column(length = 120)
    private String assignedTechnicianName;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TicketAttachment> attachments = new ArrayList<>();

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TicketComment> comments = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
