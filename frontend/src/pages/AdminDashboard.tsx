import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { bookingService, type Booking } from '../services/bookingService';
import { ticketService } from '../services/ticketService';
import type { IncidentTicket } from '../types/ticket';

type SidebarKey = 'users' | 'facility' | 'booking' | 'incidents' | 'notifications';

const menuItems: Array<{ key: SidebarKey; label: string; path?: string; description: string }> = [
  {
    key: 'users',
    label: 'Users',
    path: '/admin/users',
    description: 'Create and review user and technician accounts.',
  },
  {
    key: 'facility',
    label: 'Facility Catalogue',
    path: '/admin/facility-catalogue',
    description: 'Add, update, and remove facilities and units.',
  },
  {
    key: 'booking',
    label: 'Booking Review',
    path: '/admin-bookings',
    description: 'Inspect booking requests and approvals.',
  },
  {
    key: 'incidents',
    label: 'Facilities Overview',
    path: '/facilities-overview',
    description: 'Check live availability and unavailability notes.',
  },
  {
    key: 'notifications',
    label: 'Book Facilities',
    path: '/facilities',
    description: 'Open the public booking flow.',
  },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const [active, setActive] = useState<SidebarKey>('users');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<IncidentTicket[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setSummaryLoading(true);
        setSummaryError(null);
        const [bookingData, ticketData] = await Promise.all([
          bookingService.getAllBookings(),
          ticketService.getAllTickets({}),
        ]);
        setBookings(bookingData as Booking[]);
        setTickets(ticketData as IncidentTicket[]);
      } catch {
        setBookings([]);
        setTickets([]);
        setSummaryError('Unable to load live admin dashboard stats right now.');
      } finally {
        setSummaryLoading(false);
      }
    };

    void loadSummary();
  }, []);

  const bookingPendingCount = useMemo(
    () => bookings.filter((booking) => booking.status === 'PENDING').length,
    [bookings]
  );

  const ticketOpenCount = useMemo(
    () => tickets.filter((ticket) => ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS').length,
    [tickets]
  );

  const handleMenuClick = (key: SidebarKey) => {
    const selected = menuItems.find((item) => item.key === key);
    if (selected?.path) {
      navigate(selected.path);
      return;
    }

    setActive(key);
  };

  const getTitle = () => {
    const selected = menuItems.find((item) => item.key === active);
    return selected ? selected.label : 'Module';
  };

  return (
    <div className="min-h-screen bg-campus-surface text-slate-100">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="rounded-3xl border border-campus-line bg-campus-card p-5 shadow-campus-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-campus-accent">
            Admin Dashboard
          </p>
          <h1 className="mt-2 text-2xl font-bold">Control Panel</h1>
          <p className="mt-2 text-sm text-slate-300">
            Use this panel to move between user management, facilities, and booking tools.
          </p>

          <div className="mt-6 space-y-2">
            {menuItems.map((item) => {
              const isActive = item.key === active;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleMenuClick(item.key)}
                  className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition ${
                    isActive
                      ? 'border-campus-accent bg-campus-accent/15 text-white'
                      : 'border-campus-line bg-campus-surface/60 text-slate-200 hover:border-campus-accent/70'
                  }`}
                >
                  <span className="block">{item.label}</span>
                  <span className="mt-1 block text-xs font-normal text-slate-400">{item.description}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="rounded-3xl border border-campus-line bg-campus-card p-8 shadow-campus">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-campus-accent">
                {getTitle()}
              </p>
              <h2 className="mt-2 text-3xl font-bold">Admin operations center</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Everything needed for the admin side is connected here: user management,
                facility catalogue, booking review, and quick jumps to the public facilities pages.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="rounded-xl border border-campus-line px-4 py-2 text-sm font-semibold text-slate-200 hover:border-campus-accent hover:text-campus-accent"
            >
              Refresh Admin View
            </button>
          </div>

          <div className="mt-8 dashboard-kpi-grid">
            <article className="kpi-card">
              <p className="kpi-card__label">Total Bookings</p>
              <h3 className="kpi-card__value">{summaryLoading ? '...' : bookings.length}</h3>
              <p className="kpi-card__meta">All reservation requests</p>
            </article>

            <article className="kpi-card">
              <p className="kpi-card__label">Pending Bookings</p>
              <h3 className="kpi-card__value">{summaryLoading ? '...' : bookingPendingCount}</h3>
              <p className="kpi-card__meta">Waiting for admin approval</p>
            </article>

            <article className="kpi-card">
              <p className="kpi-card__label">Active Tickets</p>
              <h3 className="kpi-card__value">{summaryLoading ? '...' : ticketOpenCount}</h3>
              <p className="kpi-card__meta">Open or in progress</p>
            </article>

            <article className="kpi-card">
              <p className="kpi-card__label">Unread Notifications</p>
              <h3 className="kpi-card__value">{unreadCount}</h3>
              <p className="kpi-card__meta">Need your attention</p>
            </article>
          </div>

          {summaryError && <p className="dashboard-empty-note mt-3">{summaryError}</p>}

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {menuItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handleMenuClick(item.key)}
                className="rounded-2xl border border-campus-line bg-campus-surface/70 p-5 text-left transition hover:-translate-y-0.5 hover:border-campus-accent/70"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-campus-accent">
                  Open
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">{item.label}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.description}</p>
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-campus-line bg-campus-surface/80 p-5">
            <p className="text-sm text-slate-300">
              If you need the user list specifically, use the Users section. If you need live
              availability or editing tools, use the facilities pages above.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
