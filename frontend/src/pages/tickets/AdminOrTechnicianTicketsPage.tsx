import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import TicketTable from '../../components/tickets/TicketTable';
import TicketFilters from '../../components/tickets/TicketFilters';
import AssignTechnicianModal from '../../components/tickets/AssignTechnicianModal';
import UpdateStatusModal from '../../components/tickets/UpdateStatusModal';
import ResolutionNotesModal from '../../components/tickets/ResolutionNotesModal';
import { ticketService } from '../../services/ticketService';
import { getCurrentUser } from '../../services/apiClient';
import type { IncidentTicket, TicketFilters as TicketFiltersType } from '../../types/ticket';
import '../../styles/tickets/tickets.css';

const TICKET_REFRESH_EVENT = 'tickets:refresh';

const notifyTicketRefresh = () => {
  const payload = { updatedAt: Date.now() };
  window.dispatchEvent(new CustomEvent(TICKET_REFRESH_EVENT, { detail: payload }));
  localStorage.setItem(TICKET_REFRESH_EVENT, JSON.stringify(payload));
};

const AdminOrTechnicianTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [tickets, setTickets] = useState<IncidentTicket[]>([]);
  const [filters, setFilters] = useState<TicketFiltersType>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [resolutionOpen, setResolutionOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      // Allow USER role to view own tickets when opening admin/technician screens.
      if (currentUser.role === 'USER') {
        const ownTickets = await ticketService.getMyTickets();
        setTickets(ownTickets);
        return;
      }

      const effectiveFilters = { ...filters };
      if (currentUser.role === 'TECHNICIAN' && !effectiveFilters.assignedTechnician) {
        effectiveFilters.assignedTechnician = Number(currentUser.userId);
      }

      const response = await ticketService.getAllTickets(effectiveFilters);
      setTickets(response);
    } catch (err) {
      setTickets([]);
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError('You do not have permission to view this ticket list with the current role.');
      } else {
        setError('Failed to load tickets. Please ensure backend is running on port 8081 and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [JSON.stringify(filters)]);

  return (
    <div className="ticket-page">
      <div className="ticket-heading">
        <h2>{currentUser.role === 'TECHNICIAN' ? 'Assigned Tickets' : 'Ticket Management'}</h2>
        <p>Assign technicians, transition status, and track resolution progress.</p>
      </div>

      <TicketFilters filters={filters} onFiltersChange={setFilters} />

      {error && <div className="ticket-card">{error}</div>}

      {loading ? (
        <div className="ticket-card">Loading tickets...</div>
      ) : (
        <TicketTable
          tickets={tickets}
          onOpen={(id) => navigate(`/tickets/${id}`)}
          actions={(ticket) => (
            <>
              {(currentUser.role === 'ADMIN' || currentUser.role === 'STAFF') && (
                <button
                  className="ticket-button primary"
                  onClick={() => {
                    setSelectedTicketId(ticket.id);
                    setAssignOpen(true);
                  }}
                >
                  Assign
                </button>
              )}

              <button
                className="ticket-button secondary"
                onClick={() => {
                  setSelectedTicketId(ticket.id);
                  setStatusOpen(true);
                }}
              >
                Status
              </button>

              <button
                className="ticket-button secondary"
                onClick={() => {
                  setSelectedTicketId(ticket.id);
                  setResolutionOpen(true);
                }}
              >
                Notes
              </button>
            </>
          )}
        />
      )}

      <AssignTechnicianModal
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
        onConfirm={async (payload) => {
          if (!selectedTicketId) return;
          await ticketService.assignTechnician(selectedTicketId, payload);
          await load();
        }}
      />

      <UpdateStatusModal
        isOpen={statusOpen}
        onClose={() => setStatusOpen(false)}
        onConfirm={async (payload) => {
          if (!selectedTicketId) return;
          await ticketService.updateStatus(selectedTicketId, payload);
          notifyTicketRefresh();
          await load();
        }}
      />

      <ResolutionNotesModal
        isOpen={resolutionOpen}
        onClose={() => setResolutionOpen(false)}
        onConfirm={async (notes) => {
          if (!selectedTicketId) return;
          await ticketService.updateResolutionNotes(selectedTicketId, notes);
          await load();
        }}
      />
    </div>
  );
};

export default AdminOrTechnicianTicketsPage;
