package lk.sliit.it3030.smartcampus.ticket.repository;

import lk.sliit.it3030.smartcampus.ticket.entity.IncidentTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface IncidentTicketRepository extends JpaRepository<IncidentTicket, Long>, JpaSpecificationExecutor<IncidentTicket> {
    List<IncidentTicket> findByCreatedByUserIdOrderByCreatedAtDesc(Long createdByUserId);

    List<IncidentTicket> findByAssignedTechnicianIdOrderByCreatedAtDesc(Long assignedTechnicianId);
}
