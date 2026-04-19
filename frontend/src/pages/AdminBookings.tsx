import React, { useState, useEffect } from 'react';
import { bookingService, type Booking } from '../services/bookingService';
import { Calendar, Users, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllBookings(selectedStatus || undefined);
      setBookings(data);
      setError(null);
    } catch (err: any) {
      setError('Failed to load bookings. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedStatus]);

  const handleApprove = async (id: number) => {
    const reason = prompt("Enter approval reason (required):");
    if (!reason || reason.trim() === "") {
      alert("Reason is required for approval.");
      return;
    }

    try {
      await bookingService.approveBooking(id, reason);
      alert("✅ Booking approved successfully!");
      fetchBookings();
    } catch (err) {
      alert("Failed to approve booking.");
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("Enter rejection reason (required):");
    if (!reason || reason.trim() === "") {
      alert("Reason is required for rejection.");
      return;
    }

    try {
      await bookingService.rejectBooking(id, reason);
      alert("❌ Booking rejected successfully!");
      fetchBookings();
    } catch (err) {
      alert("Failed to reject booking.");
    }
  };

  const handleCancel = async (id: number) => {
    const reason = prompt("Enter cancellation reason:");
    if (!reason) return;

    try {
      await bookingService.cancelBooking(id, reason);
      alert("Booking cancelled successfully!");
      fetchBookings();
    } catch (err) {
      alert("Failed to cancel booking.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border border-red-200';
      case 'CANCELLED': return 'bg-gray-100 text-gray-700 border border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading all bookings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Admin - All Bookings</h1>
          <p className="text-gray-600 mt-2 text-lg">Review and manage all booking requests</p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending Only</option>
            <option value="APPROVED">Approved Only</option>
            <option value="REJECTED">Rejected Only</option>
            <option value="CANCELLED">Cancelled Only</option>
          </select>

          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium transition-colors"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">Booking ID</th>
              <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">Purpose</th>
              <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">Time Slot</th>
              <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">Resource</th>
              <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-8 py-5 text-center text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-6 font-mono text-gray-700">#{booking.id}</td>
                <td className="px-8 py-6">
                  <div className="font-medium text-gray-900">{booking.purpose}</div>
                  {booking.expectedAttendees && (
                    <div className="text-sm text-gray-500 mt-1">
                      {booking.expectedAttendees} attendees expected
                    </div>
                  )}
                </td>
                <td className="px-8 py-6 text-sm text-gray-600">
                  {formatDateTime(booking.startTime)}<br />
                  <span className="text-gray-400">→</span> {formatDateTime(booking.endTime)}
                </td>
                <td className="px-8 py-6 font-medium">Resource #{booking.resourceId}</td>
                <td className="px-8 py-6">
                  <span className={`inline-block px-4 py-1.5 text-xs font-semibold rounded-2xl ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-center">
                  {booking.status === 'PENDING' && (
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => handleApprove(booking.id)}
                        className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-2xl transition-colors"
                      >
                        <CheckCircle size={18} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-2xl transition-colors"
                      >
                        <XCircle size={18} /> Reject
                      </button>
                    </div>
                  )}

                  {booking.status === 'APPROVED' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="flex items-center gap-2 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-2xl transition-colors mx-auto"
                    >
                      <AlertTriangle size={18} /> Cancel Booking
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No bookings found matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;