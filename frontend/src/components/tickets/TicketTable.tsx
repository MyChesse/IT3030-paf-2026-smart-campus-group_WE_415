import React from 'react';
import type { IncidentTicket } from '../../types/ticket';
import StatusBadge from './StatusBadge';

interface TicketTableProps {
  tickets: IncidentTicket[];
  onOpen: (ticketId: number) => void;
  actions?: (ticket: IncidentTicket) => React.ReactNode;
}

const TicketTable: React.FC<TicketTableProps> = ({ tickets, onOpen, actions }) => {
  return (
    <div className="ticket-table-wrapper">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Title</th>
            <th>Category</th>
            <th>Status / Priority</th>
            <th>Assigned</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.ticketCode}</td>
              <td>{ticket.title}</td>
              <td>{ticket.category}</td>
              <td><StatusBadge status={ticket.status} priority={ticket.priority} /></td>
              <td>{ticket.assignedTechnicianName || '-'}</td>
              <td>{new Date(ticket.createdAt).toLocaleString()}</td>
              <td>
                <div className="ticket-actions">
                  <button className="ticket-button secondary" onClick={() => onOpen(ticket.id)}>View</button>
                  {actions && actions(ticket)}
                </div>
              </td>
            </tr>
          ))}
          {tickets.length === 0 && (
            <tr>
              <td colSpan={7}>No tickets found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
