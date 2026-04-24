import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useNotifications } from './hooks/useNotifications';
import { bookingService, type Booking } from './services/bookingService';
import { ticketService } from './services/ticketService';
import type { IncidentTicket } from './types/ticket';

export default function DashboardPage() {
  const { user, isAdmin, isTechnician } = useAuth();
  const { unreadCount } = useNotifications();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<IncidentTicket[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const cards = [
    { title: 'Bookings', description: 'Request and manage your bookings.', link: '/bookings' },
    { title: isTechnician && !isAdmin ? 'My Tickets' : 'Tickets', description: 'Track incidents and tasks.', link: '/tickets' },
    {
      title: 'Notifications',
      description: `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.`,
      link: '/notifications',
    },
  ];

  if (isAdmin) {
    cards.push({ title: 'Admin Panel', description: 'Manage users and technicians.', link: '/admin' });
  }

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setSummaryLoading(true);
        setSummaryError(null);

        const bookingPromise = isAdmin
          ? bookingService.getAllBookings()
          : bookingService.getMyBookings();

        const ticketPromise = isAdmin || isTechnician
          ? ticketService.getAllTickets({})
          : ticketService.getMyTickets();

        const [bookingData, ticketData] = await Promise.all([
          bookingPromise,
          ticketPromise,
        ]);

        setBookings(bookingData as Booking[]);
        setTickets(ticketData as IncidentTicket[]);
      } catch {
        setBookings([]);
        setTickets([]);
        setSummaryError('Unable to load live dashboard stats right now.');
      } finally {
        setSummaryLoading(false);
      }
    };

    void loadSummary();
  }, [isAdmin, isTechnician]);

  const bookingPendingCount = useMemo(
    () => bookings.filter((booking) => booking.status === 'PENDING').length,
    [bookings]
  );

  const ticketOpenCount = useMemo(
    () => tickets.filter((ticket) => ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS').length,
    [tickets]
  );

  const nextBooking = useMemo(
    () =>
      [...bookings]
        .filter((booking) => new Date(booking.startTime).getTime() >= Date.now())
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0],
    [bookings]
  );

  const recentTicket = useMemo(
    () => [...tickets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0],
    [tickets]
  );

  const quickActions = [
    { label: 'Create Booking', link: '/create-booking' },
    { label: 'Create Ticket', link: '/tickets/create' },
    { label: 'View My Bookings', link: '/bookings' },
  ];

  if (isAdmin) {
    quickActions.push({ label: 'Open Admin Panel', link: '/admin' });
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="page-container">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-hero__eyebrow">Smart Campus Operations Hub</p>
          <h2 className="dashboard-hero__title">Welcome back, {user?.name?.split(' ')[0] || 'User'}</h2>
          <p className="dashboard-hero__text">Access your daily tasks, resources, and approvals in one place.</p>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-kpi-grid">
          <article className="kpi-card">
            <p className="kpi-card__label">My Bookings</p>
            <h3 className="kpi-card__value">{summaryLoading ? '...' : bookings.length}</h3>
            <p className="kpi-card__meta">Total reservation requests</p>
          </article>

          <article className="kpi-card">
            <p className="kpi-card__label">Pending Bookings</p>
            <h3 className="kpi-card__value">{summaryLoading ? '...' : bookingPendingCount}</h3>
            <p className="kpi-card__meta">Waiting for confirmation</p>
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
        {summaryError && <p className="dashboard-empty-note">{summaryError}</p>}
      </section>

      <section className="dashboard-section">
        <div className="dashboard-actions">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.link} className="dashboard-quick-btn">
              {action.label}
            </Link>
          ))}
        </div>

        <div className="dashboard-grid">
          {cards.map((card) => (
            <Link to={card.link} key={card.title} className="dashboard-card">
              <div className="dashboard-card__body">
                <div className="dashboard-card__title-row">
                  <h2 className="dashboard-card__title">{card.title}</h2>
                </div>
                <p className="dashboard-card__desc">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <article className="info-panel">
          <h3>Upcoming Focus</h3>
          {nextBooking ? (
            <div className="overview-item">
              <span>{new Date(nextBooking.startTime).toLocaleString()}</span>
              <strong>{nextBooking.purpose}</strong>
            </div>
          ) : (
            <p className="dashboard-empty-note">No upcoming bookings yet. Create one to reserve a space.</p>
          )}
          <ul className="info-list">
            <li>Review your pending booking approvals.</li>
            <li>Track ticket status updates regularly.</li>
            <li>Keep your profile and notifications updated.</li>
          </ul>
        </article>

        <article className="info-panel">
          <h3>Recent Activity Snapshot</h3>
          <div className="overview-item">
            <span>Latest Ticket</span>
            <strong>{recentTicket ? recentTicket.ticketCode : 'No tickets yet'}</strong>
          </div>
          <div className="overview-item">
            <span>Ticket Status</span>
            <strong>{recentTicket ? recentTicket.status : '-'}</strong>
          </div>
          <div className="overview-item">
            <span>Latest Booking</span>
            <strong>{bookings[0] ? bookings[0].purpose : 'No bookings yet'}</strong>
          </div>
          <div className="overview-item">
            <span>My Role</span>
            <strong>{isAdmin ? 'ADMIN' : isTechnician ? 'TECHNICIAN' : 'USER'}</strong>
          </div>
        </article>
      </section>
    </div>
  );
}
