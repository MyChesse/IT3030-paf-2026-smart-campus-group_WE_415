import api from '../api/axiosInstance';

// Booking Interface - Exported correctly
export interface Booking {
  id: number;
  resourceId: number;
  userId: number;
  startTime: string;
  endTime: string;
  purpose: string;
  expectedAttendees?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  rejectionReason?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: number;
  name: string;
  type: string;
  capacity: number;
  location: string;
}

export const bookingService = {
  // Create a new booking
  createBooking: async (data: any) => {
    const response = await api.post('/api/bookings', data);
    return response.data;
  },

  // Get current user's bookings
  getMyBookings: async () => {
    const response = await api.get('/api/bookings/my');
    return response.data;
  },

  getResources: async () => {
    const response = await api.get('/api/resources');
    return response.data;
  },


  // Get all bookings (Admin)
  getAllBookings: async (status?: string) => {
    const url = status ? `/api/bookings?status=${status}` : '/api/bookings';
    const response = await api.get(url);
    return response.data;
  },

  // Approve booking
  approveBooking: async (id: number, reason: string) => {
    const response = await api.patch(`/api/bookings/${id}/approve`, { reason });
    return response.data;
  },

  // Reject booking
  rejectBooking: async (id: number, reason: string) => {
    const response = await api.patch(`/api/bookings/${id}/reject`, { reason });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: number, reason: string) => {
    const response = await api.patch(`/api/bookings/${id}/cancel`, { reason });
    return response.data;
  },
};