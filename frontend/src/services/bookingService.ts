import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const bookingService = {
  // Create a new booking
  createBooking: async (data: any) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  // Get current user's bookings
  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  // Get all bookings (Admin)
  getAllBookings: async (status?: string) => {
    const url = status ? `/bookings?status=${status}` : '/bookings';
    const response = await api.get(url);
    return response.data;
  },

  // Approve booking
  approveBooking: async (id: number, reason: string) => {
    const response = await api.patch(`/bookings/${id}/approve`, { reason });
    return response.data;
  },

  // Reject booking
  rejectBooking: async (id: number, reason: string) => {
    const response = await api.patch(`/bookings/${id}/reject`, { reason });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: number, reason: string) => {
    const response = await api.patch(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },
};