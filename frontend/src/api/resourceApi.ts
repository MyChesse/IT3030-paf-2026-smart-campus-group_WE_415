import api from './axiosInstance';

export interface ResourcePayload {
  name: string;
  category: string;
  location: string;
  description?: string;
  capacity: number;
  available: boolean;
  amenities: string[];
  imageUrl?: string;
  contactPerson?: string;
}

export const resourceApi = {
  getAll: (params: Record<string, unknown> = {}) => api.get('/api/resources', { params }),
  getById: (id: string) => api.get(`/api/resources/${id}`),
  create: (payload: ResourcePayload) => api.post('/api/resources', payload),
  update: (id: string, payload: ResourcePayload) => api.put(`/api/resources/${id}`, payload),
  remove: (id: string) => api.delete(`/api/resources/${id}`),
};
