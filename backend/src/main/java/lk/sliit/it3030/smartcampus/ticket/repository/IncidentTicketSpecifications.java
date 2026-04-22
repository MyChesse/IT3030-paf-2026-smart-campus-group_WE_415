package lk.sliit.it3030.smartcampus.ticket.repository;

import lk.sliit.it3030.smartcampus.ticket.dto.TicketListFiltersDto;
import lk.sliit.it3030.smartcampus.ticket.entity.IncidentTicket;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class IncidentTicketSpecifications {

    private IncidentTicketSpecifications() {
    }

    public static Specification<IncidentTicket> withFilters(TicketListFiltersDto filters) {
        return (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            if (filters.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filters.getStatus()));
            }
            if (filters.getPriority() != null) {
                predicates.add(cb.equal(root.get("priority"), filters.getPriority()));
            }
            if (filters.getCategory() != null && !filters.getCategory().isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("category")), filters.getCategory().trim().toLowerCase()));
            }
            if (filters.getAssignedTechnicianId() != null) {
                predicates.add(cb.equal(root.get("assignedTechnicianId"), filters.getAssignedTechnicianId()));
            }
            if (filters.getSearch() != null && !filters.getSearch().isBlank()) {
                String q = "%" + filters.getSearch().trim().toLowerCase() + "%";
                predicates.add(
                        cb.or(
                                cb.like(cb.lower(root.get("ticketCode")), q),
                                cb.like(cb.lower(root.get("title")), q),
                                cb.like(cb.lower(root.get("location")), q)
                        )
                );
            }

            query.orderBy(cb.desc(root.get("createdAt")));
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
}
