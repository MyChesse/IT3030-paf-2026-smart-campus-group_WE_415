import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import type { IncidentTicket } from '../../types/ticket';
import { ticketService } from '../../services/ticketService';
import TicketCard from '../../components/tickets/TicketCard';
import { Search, Filter, Plus, FileText } from 'lucide-react';

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

  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'OPEN').length;
    const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolved = tickets.filter(t => ['RESOLVED', 'CLOSED'].includes(t.status)).length;
    return { total, open, inProgress, resolved };
  }, [tickets]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-[28px] shadow-xl p-8 mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-2xl">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
              <p className="text-gray-600 mt-1">Track your incident reports and their progress.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/tickets/create')}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-2xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Create New Ticket
          </button>
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
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-900">{stats.resolved}</div>
            <div className="text-sm text-green-700">Resolved</div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ticket code, title, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[28px] shadow-xl p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-600 mb-6">
            {search || statusFilter ? 'Try adjusting your search or filters.' : 'You haven\'t created any tickets yet.'}
          </p>
          {!search && !statusFilter && (
            <button
              onClick={() => navigate('/tickets/create')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-2xl transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Your First Ticket
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onOpen={(id) => navigate(`/tickets/${id}`)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
