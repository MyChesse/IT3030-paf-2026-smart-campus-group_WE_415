import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { isAdmin, isTechnician } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: 'DB' },
    { to: '/facilities-overview', label: 'Facilities Overview', icon: 'FO' },
    { to: '/facilities', label: 'Book Facilities', icon: 'FC' },
    { to: '/resources', label: 'Resources', icon: 'RS' },
    { to: '/create-booking', label: 'Create Booking', icon: 'CB' },
    { to: '/bookings', label: 'My Bookings', icon: 'MB' },
    { to: '/tickets', label: isTechnician && !isAdmin ? 'My Tickets' : 'Tickets', icon: 'TK' },
    { to: '/notifications', label: 'Notifications', icon: 'NT' },
    { to: '/profile', label: 'Profile', icon: 'PR' },
  ];

  if (isAdmin) {
    links.splice(2, 0, { to: '/admin', label: 'Admin Dashboard', icon: 'AD' });
    links.splice(3, 0, { to: '/admin/facility-catalogue', label: 'Facility Catalogue', icon: 'FL' });
    links.splice(4, 0, { to: '/admin/users', label: 'Manage Users', icon: 'MU' });
    links.splice(5, 0, { to: '/admin-bookings', label: 'Booking Review', icon: 'BR' });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">SmartUni</div>
      <nav className="sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
          >
            <span className="sidebar__icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
