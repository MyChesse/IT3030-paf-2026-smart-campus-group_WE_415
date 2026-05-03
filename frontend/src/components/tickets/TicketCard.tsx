import React from 'react';
import { Ticket, MapPin, Clock3, User, Tag } from 'lucide-react';
import type { IncidentTicket } from '../../types/ticket';
import StatusBadge from './StatusBadge';

interface TicketCardProps {
  ticket: IncidentTicket;
  onOpen: (ticketId: number) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onOpen }) => {
  return (
    <div className="ticket-card" role="button" onClick={() => onOpen(ticket.id)}>
      <div className="ticket-card-header">
        <div className="ticket-card-top">
          <div className="ticket-card-icon">
            <Ticket className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Ticket</p>
            <strong className="ticket-card-code">{ticket.ticketCode}</strong>
          </div>
        </div>
        <StatusBadge status={ticket.status} priority={ticket.priority} />
      </div>

      <h3 className="ticket-card-title">{ticket.title}</h3>
      <p className="ticket-card-description">{ticket.description}</p>

      <div className="ticket-meta">
        <span className="ticket-card-chip">
          <Tag className="h-4 w-4" />
          {ticket.category}
        </span>
        <span className="ticket-card-chip">
          <MapPin className="h-4 w-4" />
          {ticket.location}
        </span>
        <span className="ticket-card-chip">
          <Clock3 className="h-4 w-4" />
          {new Date(ticket.createdAt).toLocaleString()}
        </span>
        {ticket.assignedTechnicianName && (
          <span className="ticket-card-chip">
            <User className="h-4 w-4" />
            Assigned: {ticket.assignedTechnicianName}
          </span>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
