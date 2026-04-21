import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useNotifications } from './hooks/useNotifications';

export default function DashboardPage() {
  const { user, isAdmin, isTechnician } = useAuth();
  const { unreadCount } = useNotifications();

  const cards = [
    { title: 'Resources', description: 'Browse and search campus facilities.', link: '/resources' },
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
    </div>
  );
}
