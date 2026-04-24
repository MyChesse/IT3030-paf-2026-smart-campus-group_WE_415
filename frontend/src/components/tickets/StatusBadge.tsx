import React from 'react';
import type { TicketPriority, TicketStatus } from '../../types/ticket';

interface StatusBadgeProps {
  status: TicketStatus;
  priority?: TicketPriority;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, priority }) => {
  return (
    <div className="ticket-actions">
      <span className={`ticket-badge ${status}`}>{status.replace('_', ' ')}</span>
      {priority && <span className={`priority-badge ${priority}`}>{priority}</span>}
    </div>
  );
};

export default StatusBadge;
