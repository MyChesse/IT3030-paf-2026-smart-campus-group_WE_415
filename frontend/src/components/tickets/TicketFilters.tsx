import React from 'react';
import type { TicketFilters } from '../../types/ticket';

interface TicketFiltersProps {
  filters: TicketFilters;
  onFiltersChange: (next: TicketFilters) => void;
}

const TicketFiltersComponent: React.FC<TicketFiltersProps> = ({ filters, onFiltersChange }) => {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-slate-50/90 shadow-sm backdrop-blur-md p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Ticket Filters</h2>
          <p className="text-sm text-slate-500">Search and refine tickets by status, priority, category, or technician.</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1.8fr_repeat(4,1fr)]">
        <input
          className="w-full rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 text-sm text-white placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Search code/title/location"
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        />
        <select
          className="w-full rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 text-sm text-white placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
          className="w-full rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 text-sm text-white placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
          className="w-full rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 text-sm text-white placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Category"
          value={filters.category || ''}
          onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
        />
        <input
          className="w-full rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 text-sm text-white placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          type="number"
          placeholder="Assigned Technician ID"
          value={filters.assignedTechnician || ''}
          onChange={(e) => onFiltersChange({
            ...filters,
            assignedTechnician: e.target.value ? Number(e.target.value) : undefined,
          })}
        />
      </div>
    </div>
  );
};

export default TicketFiltersComponent;
