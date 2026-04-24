import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/resources': 'Resources',
  '/bookings': 'Bookings',
  '/create-booking': 'Create Booking',
  '/my-bookings': 'My Bookings',
  '/admin-bookings': 'Booking Review',
  '/tickets': 'Tickets',
  '/tickets/create': 'Create Ticket',
  '/tickets/my': 'My Tickets',
  '/admin/tickets': 'Ticket Management',
  '/technician/tickets': 'Assigned Tickets',
  '/notifications': 'Notifications',
  '/profile': 'Profile',
  '/admin': 'Admin Panel',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pageTitle = PAGE_TITLES[location.pathname] || 'SmartUni';
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div>
        <h1 className="topbar__title">{pageTitle}</h1>
        <p className="topbar__subtitle">Welcome back, {user?.name ?? 'User'}</p>
      </div>

      <div className="topbar__right">
        <NotificationPanel />

        <div className="user-menu" ref={menuRef}>
          <button className="user-menu__trigger" onClick={() => setMenuOpen((prev) => !prev)}>
            {user?.profilePictureUrl ? (
              <img src={user.profilePictureUrl} alt={user.name} className="user-menu__avatar" />
            ) : (
              <div className="user-menu__avatar user-menu__avatar--initials">{initials}</div>
            )}
          </button>

          {menuOpen && (
            <div className="user-menu__dropdown">
              <div className="user-menu__info">
                <span className="user-menu__name">{user?.name}</span>
                <span className="user-menu__email">{user?.email}</span>
              </div>
              <hr className="user-menu__divider" />
              <Link to="/profile" className="user-menu__item" onClick={() => setMenuOpen(false)}>
                My profile
              </Link>
              <Link to="/notifications" className="user-menu__item" onClick={() => setMenuOpen(false)}>
                Notifications
              </Link>
              <hr className="user-menu__divider" />
              <button className="user-menu__item user-menu__item--danger" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
