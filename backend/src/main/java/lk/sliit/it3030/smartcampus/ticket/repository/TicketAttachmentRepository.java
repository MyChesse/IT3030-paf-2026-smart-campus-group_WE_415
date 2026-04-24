package lk.sliit.it3030.smartcampus.ticket.repository;

import lk.sliit.it3030.smartcampus.ticket.entity.TicketAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {
    long countByTicketId(Long ticketId);

    List<TicketAttachment> findByTicketId(Long ticketId);
}
