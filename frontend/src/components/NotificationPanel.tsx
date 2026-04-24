import { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, refresh } = useNotifications();

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current && !panelRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      refresh();
    }
  }, [open, refresh]);

  const preview = notifications.slice(0, 5);

  return (
    <div className="notif-panel" ref={panelRef}>
      <button className="notif-bell" onClick={() => setOpen((prev) => !prev)} aria-label="Notifications">
        N
        {unreadCount > 0 && <span className="notif-bell__badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown__header">
            <span className="notif-dropdown__title">Notifications</span>
            {unreadCount > 0 && (
              <button className="notif-dropdown__mark-all" onClick={() => void markAllAsRead()}>
                Mark all read
              </button>
            )}
          </div>

          {preview.length === 0 ? (
            <div className="notif-dropdown__empty">No notifications yet</div>
          ) : (
            <ul className="notif-dropdown__list">
              {preview.map((n) => (
                <li
                  key={n.id}
                  className={`notif-dropdown__item ${!n.read ? 'notif-dropdown__item--unread' : ''}`}
                  onClick={() => {
                    if (!n.read) {
                      void markAsRead(n.id);
                    }
                  }}
                >
                  <div className="notif-dropdown__item-body">
                    <p className="notif-dropdown__item-title">{n.title}</p>
                    <p className="notif-dropdown__item-msg">{n.message}</p>
                    <span className="notif-dropdown__item-time">
                      {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : ''}
                    </span>
                  </div>
                  <button
                    className="btn-icon btn-icon--danger"
                    onClick={(event) => {
                      event.stopPropagation();
                      void deleteNotification(n.id);
                    }}
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="notif-dropdown__footer">
            <Link to="/notifications" className="notif-dropdown__view-all" onClick={() => setOpen(false)}>
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
