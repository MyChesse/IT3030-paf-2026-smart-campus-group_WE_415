import React from 'react';
import { Link, useLocation } from 'react-router';
import { Home, Calendar, Bell, Wrench, Users } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/create-booking', icon: Calendar, label: 'Create Booking' },
  { path: '/my-bookings', icon: Users, label: 'My Bookings' },
  { path: '/admin', icon: Wrench, label: 'Admin Panel' },
  { path: '/tickets/create', icon: Calendar, label: 'Create Ticket' },
  { path: '/tickets/my', icon: Users, label: 'My Tickets' },
  { path: '/admin/tickets', icon: Wrench, label: 'Ticket Management' },
  { path: '/notices', icon: Bell, label: 'Notices' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-72 bg-white border-r h-screen fixed left-0 top-0 pt-20 shadow-sm">
      <div className="px-6 py-8">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon 
                  size={22} 
                  className={isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"} 
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;