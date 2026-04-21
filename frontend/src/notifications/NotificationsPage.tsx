import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../hooks/useNotifications';

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  BOOKING_APPROVED: { label: 'Booking approved', color: '#10b981' },
  BOOKING_REJECTED: { label: 'Booking rejected', color: '#ef4444' },
  BOOKING_CANCELLED: { label: 'Booking cancelled', color: '#6b7280' },
  TICKET_STATUS_CHANGED: { label: 'Ticket updated', color: '#f59e0b' },
  TICKET_COMMENT_ADDED: { label: 'New comment', color: '#6366f1' },
};

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, hasMore, markAsRead, markAllAsRead, deleteNotification, loadMore } = useNotifications();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          {unreadCount > 0 && <p className="page-subtitle">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && <button className="btn btn-outline" onClick={() => void markAllAsRead()}>Mark all as read</button>}
      </div>

      {loading && notifications.length === 0 ? (
        <div className="empty-state"><div className="spinner" /><p>Loading notifications...</p></div>
      ) : notifications.length === 0 ? (
        <div className="empty-state"><h3>All caught up!</h3><p>You have no notifications yet.</p></div>
      ) : (
        <>
          <ul className="notification-list">
            {notifications.map((n) => {
              const meta = TYPE_LABELS[n.type] || { label: n.type, color: '#6b7280' };
              return (
                <li key={n.id} className={`notification-item ${!n.read ? 'notification-item--unread' : ''}`} onClick={() => { if (!n.read) void markAsRead(n.id); }}>
                  <div className="notification-item__dot" style={{ background: meta.color }} />
                  <div className="notification-item__body">
                    <div className="notification-item__header">
                      <span className="notification-item__type" style={{ color: meta.color }}>{meta.label}</span>
                      <span className="notification-item__time">{n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : ''}</span>
                    </div>
                    <p className="notification-item__title">{n.title}</p>
                    <p className="notification-item__message">{n.message}</p>
                  </div>
                  <div className="notification-item__actions">
                    {!n.read && (
                      <button className="btn-icon" onClick={(e) => { e.stopPropagation(); void markAsRead(n.id); }}>
                        read
                      </button>
                    )}
                    <button className="btn-icon btn-icon--danger" onClick={(e) => { e.stopPropagation(); void deleteNotification(n.id); }}>
                      del
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button className="btn btn-outline" onClick={loadMore} disabled={loading}>{loading ? 'Loading...' : 'Load more'}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
