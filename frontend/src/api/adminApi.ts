import api from './axiosInstance';

export interface TechnicianCreatePayload {
  name: string;
  email: string;
  password: string;
}

export const adminApi = {
  getUsers: () => api.get('/api/admin/users'),
  getTechnicians: () => api.get('/api/admin/technicians'),
  createTechnician: (data: TechnicianCreatePayload) => api.post('/api/admin/technicians', data),
  deleteUser: (userId: number) => api.delete(`/api/admin/users/${userId}`),
};
