import React from 'react';
import type { TicketFilters } from '../../types/ticket';

interface TicketFiltersProps {
  filters: TicketFilters;
  onFiltersChange: (next: TicketFilters) => void;
}

const TicketFiltersComponent: React.FC<TicketFiltersProps> = ({ filters, onFiltersChange }) => {
  return (
    <div className="ticket-filter-bar">
      <input
        placeholder="Search code/title/location"
        value={filters.search || ''}
        onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
      />
      <select
        value={filters.status || ''}
        onChange={(e) => onFiltersChange({ ...filters, status: (e.target.value || undefined) as TicketFilters['status'] })}
      >
        <option value="">All Statuses</option>
        <option value="OPEN">OPEN</option>
        <option value="IN_PROGRESS">IN PROGRESS</option>
        <option value="RESOLVED">RESOLVED</option>
        <option value="CLOSED">CLOSED</option>
        <option value="REJECTED">REJECTED</option>
      </select>
      <select
        value={filters.priority || ''}
        onChange={(e) => onFiltersChange({ ...filters, priority: (e.target.value || undefined) as TicketFilters['priority'] })}
      >
        <option value="">All Priorities</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
        <option value="CRITICAL">CRITICAL</option>
      </select>
      <input
        placeholder="Category"
        value={filters.category || ''}
        onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
      />
      <input
        type="number"
        placeholder="Assigned Technician ID"
        value={filters.assignedTechnician || ''}
        onChange={(e) => onFiltersChange({
          ...filters,
          assignedTechnician: e.target.value ? Number(e.target.value) : undefined,
        })}
      />
    </div>
  );
};

export default TicketFiltersComponent;
