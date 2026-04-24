import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { isAdmin, isTechnician } = useAuth();

  const commonLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: 'DB' },
    { to: '/notifications', label: 'Notifications', icon: 'NT' },
    { to: '/profile', label: 'Profile', icon: 'PR' },
  ];

  const userLinks = [
    { to: '/facilities-overview', label: 'Facilities Overview', icon: 'FO' },
    { to: '/facilities', label: 'Book Facilities', icon: 'FC' },
    { to: '/resources', label: 'Resources', icon: 'RS' },
    { to: '/create-booking', label: 'Create Booking', icon: 'CB' },
    { to: '/bookings', label: 'My Bookings', icon: 'MB' },
    { to: '/tickets/create', label: 'Create Ticket', icon: 'CT' },
    { to: '/tickets/my', label: 'My Tickets', icon: 'TK' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Dashboard', icon: 'AD' },
    { to: '/admin/facility-catalogue', label: 'Facility Catalogue', icon: 'FL' },
    { to: '/admin/users', label: 'Manage Users', icon: 'MU' },
    { to: '/admin-bookings', label: 'Booking Review', icon: 'BR' },
    { to: '/admin/tickets', label: 'Ticket Management', icon: 'TM' },
  ];

  const technicianLinks = [{ to: '/technician/tickets', label: 'Assigned Tickets', icon: 'AT' }];

  const links = [
    commonLinks[0],
    ...(isAdmin ? adminLinks : userLinks),
    ...(!isAdmin && isTechnician ? technicianLinks : []),
    ...commonLinks.slice(1),
  ];

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
