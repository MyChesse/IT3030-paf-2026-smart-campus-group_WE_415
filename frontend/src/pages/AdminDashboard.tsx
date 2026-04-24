import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type SidebarKey = 'users' | 'facility' | 'booking' | 'incidents' | 'notifications';

const menuItems: Array<{ key: SidebarKey; label: string }> = [
  { key: 'users', label: 'Users' },
  { key: 'facility', label: 'Facility Catalogue' },
  { key: 'booking', label: 'Booking' },
  { key: 'incidents', label: 'Incidents' },
  { key: 'notifications', label: 'Notifications' },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState<SidebarKey>('users');

  const handleMenuClick = (key: SidebarKey) => {
    if (key === 'facility') {
      navigate('/admin/facility-catalogue');
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
                  {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="rounded-3xl border border-campus-line bg-campus-card p-8 shadow-campus">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-campus-accent">
            {getTitle()}
          </p>
          <h2 className="mt-2 text-3xl font-bold">Still Constructing</h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            This section is still constructing. Please check back soon.
          </p>

          <div className="mt-8 rounded-2xl border border-campus-line bg-campus-surface/80 p-5">
            <p className="text-sm text-slate-300">
              To manage facility items and units, open the Facility Catalogue from the sidebar.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
