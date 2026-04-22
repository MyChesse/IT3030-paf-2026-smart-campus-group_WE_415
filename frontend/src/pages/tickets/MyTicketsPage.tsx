import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import type { IncidentTicket } from '../../types/ticket';
import { ticketService } from '../../services/ticketService';
import TicketCard from '../../components/tickets/TicketCard';
import '../../styles/tickets/tickets.css';

const TICKET_REFRESH_EVENT = 'tickets:refresh';

const MyTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<IncidentTicket[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getMyTickets();
      setTickets(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const refreshTickets = () => {
      load();
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === TICKET_REFRESH_EVENT) {
        refreshTickets();
      }
    };

    window.addEventListener(TICKET_REFRESH_EVENT, refreshTickets);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener(TICKET_REFRESH_EVENT, refreshTickets);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const filtered = useMemo(() => {
    return tickets.filter((ticket) => {
      const q = search.toLowerCase();
      const matchesSearch =
        ticket.ticketCode.toLowerCase().includes(q) ||
        ticket.title.toLowerCase().includes(q) ||
        ticket.location.toLowerCase().includes(q);
      const matchesStatus = statusFilter ? ticket.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [tickets, search, statusFilter]);

  return (
    <div className="ticket-page">
      <div className="ticket-heading">
        <h2>My Tickets</h2>
        <p>Track status, technician updates, and discussion for your incidents.</p>
      </div>

      <div className="ticket-filter-bar">
        <input
          placeholder="Search by code, title, location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      {loading ? (
        <div className="ticket-card">Loading tickets...</div>
      ) : filtered.length === 0 ? (
        <div className="ticket-card">No incident tickets found.</div>
      ) : (
        <div className="ticket-grid">
          {filtered.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onOpen={(id) => navigate(`/tickets/${id}`)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
