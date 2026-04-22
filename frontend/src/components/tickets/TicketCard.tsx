import React from 'react';
import type { IncidentTicket } from '../../types/ticket';
import StatusBadge from './StatusBadge';

interface TicketCardProps {
  ticket: IncidentTicket;
  onOpen: (ticketId: number) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onOpen }) => {
  return (
    <div className="ticket-card" role="button" onClick={() => onOpen(ticket.id)}>
      <div className="ticket-actions" style={{ justifyContent: 'space-between' }}>
        <strong>{ticket.ticketCode}</strong>
        <StatusBadge status={ticket.status} priority={ticket.priority} />
      </div>
      <h3>{ticket.title}</h3>
      <p>{ticket.description}</p>
      <div className="ticket-meta">
        <span>{ticket.category}</span>
        <span>{ticket.location}</span>
        <span>{new Date(ticket.createdAt).toLocaleString()}</span>
        {ticket.assignedTechnicianName && <span>Assigned: {ticket.assignedTechnicianName}</span>}
      </div>
    </div>
  );
};

export default TicketCard;
