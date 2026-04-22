import apiClient from './apiClient';
import type {
  AssignTechnicianPayload,
  CreateTicketPayload,
  IncidentTicket,
  TicketFilters,
  TicketStatus,
  UpdateStatusPayload,
} from '../types/ticket';

const toQueryString = (filters: TicketFilters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  const query = params.toString();
  return query ? `?${query}` : '';
};

export const ticketService = {
  async createTicket(payload: CreateTicketPayload, files: File[]) {
    const formData = new FormData();
    formData.append('ticket', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    files.forEach((file) => formData.append('attachments', file));

    const response = await apiClient.post<IncidentTicket>('/tickets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getMyTickets() {
    const response = await apiClient.get<IncidentTicket[]>('/tickets/my');
    return response.data;
  },

  async getAllTickets(filters: TicketFilters) {
    const response = await apiClient.get<IncidentTicket[]>(`/tickets${toQueryString(filters)}`);
    return response.data;
  },

  async getTicketById(id: number) {
    const response = await apiClient.get<IncidentTicket>(`/tickets/${id}`);
    return response.data;
  },

  async assignTechnician(id: number, payload: AssignTechnicianPayload) {
    const response = await apiClient.patch<IncidentTicket>(`/tickets/${id}/assign`, payload);
    return response.data;
  },

  async updateStatus(id: number, payload: UpdateStatusPayload) {
    const response = await apiClient.patch<IncidentTicket>(`/tickets/${id}/status`, payload);
    return response.data;
  },

  async updateResolutionNotes(id: number, resolutionNotes: string) {
    const response = await apiClient.patch<IncidentTicket>(`/tickets/${id}/resolution`, { resolutionNotes });
    return response.data;
  },

  getStatusOptions(): TicketStatus[] {
    return ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];
  },
};
