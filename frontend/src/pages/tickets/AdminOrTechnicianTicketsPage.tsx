import React, { useEffect, useState, useMemo } from 'react';
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
import { LayoutGrid, AlertTriangle, Briefcase } from 'lucide-react';

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

  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'OPEN').length;
    const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
    const critical = tickets.filter(t => t.priority === 'CRITICAL').length;
    return { total, open, inProgress, critical };
  }, [tickets]);

  const isAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'STAFF';
  const isTechnician = currentUser.role === 'TECHNICIAN';

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-[28px] shadow-xl p-8 mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-2xl">
              <LayoutGrid className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isTechnician ? 'My Assigned Tickets' : 'Ticket Management'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isTechnician 
                  ? 'View and manage your assigned tickets.' 
                  : 'Assign technicians, transition status, and track resolution progress.'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <div className="text-sm text-blue-700">Total Tickets</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200">
            <div className="text-2xl font-bold text-orange-900">{stats.open}</div>
            <div className="text-sm text-orange-700">Open</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-900">{stats.inProgress}</div>
            <div className="text-sm text-yellow-700">In Progress</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 border border-red-200">
            <div className="text-2xl font-bold text-red-900">{stats.critical}</div>
            <div className="text-sm text-red-700">Critical</div>
          </div>
        </div>

        {/* Filters Section */}
        <TicketFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-[28px] p-6 mb-8 text-red-900">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 mt-0.5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <TicketTable
          tickets={tickets}
          onOpen={(id) => navigate(`/tickets/${id}`)}
          onAssign={(ticket) => {
            setSelectedTicketId(ticket.id);
            setAssignOpen(true);
          }}
          onStatus={(ticket) => {
            setSelectedTicketId(ticket.id);
            setStatusOpen(true);
          }}
          onNotes={(ticket) => {
            setSelectedTicketId(ticket.id);
            setResolutionOpen(true);
          }}
          showAssignButton={isAdmin}
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
