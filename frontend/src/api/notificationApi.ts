import api from './axiosInstance';

export const notificationApi = {
  getAll: (page = 0, size = 20) => api.get('/api/notifications', { params: { page, size } }),
  getUnreadCount: () => api.get('/api/notifications/unread-count'),
  markAsRead: (id: number) => api.patch(`/api/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/api/notifications/read-all'),
  deleteNotification: (id: number) => api.delete(`/api/notifications/${id}`),
};
