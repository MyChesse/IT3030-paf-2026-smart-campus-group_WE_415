package lk.sliit.it3030.smartcampus.ticket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ticket_attachments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String originalFileName;

    @Column(nullable = false, unique = true, length = 255)
    private String storedFileName;

    @Column(nullable = false, length = 100)
    private String fileType;

    @Column(nullable = false, length = 500)
    private String filePath;

    @Column(nullable = false)
    private Long fileSize;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private IncidentTicket ticket;
}
