import React, { useState, useEffect } from 'react';
import { bookingService, type Booking } from '../services/bookingService';
import { Calendar, Clock, Users, AlertCircle, RefreshCw } from 'lucide-react';

const BOOKING_REFRESH_EVENT = 'bookings:refresh';

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data);
      setError(null);
    } catch (err: any) {
      setError('Failed to load your bookings. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  useEffect(() => {
    const refreshBookings = () => {
      fetchMyBookings();
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === BOOKING_REFRESH_EVENT) {
        refreshBookings();
      }
    };

    window.addEventListener(BOOKING_REFRESH_EVENT, refreshBookings);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener(BOOKING_REFRESH_EVENT, refreshBookings);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

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

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage all your booking requests</p>
        </div>
        <button
          onClick={fetchMyBookings}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-70"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3">
          <AlertCircle size={24} />
          {error}
        </div>
      )}

      {bookings.length === 0 && !loading ? (
        <div className="bg-white rounded-3xl shadow p-16 text-center">
          <Calendar className="w-20 h-20 mx-auto text-gray-300 mb-6" />
          <h3 className="text-2xl font-semibold text-gray-700">No bookings yet</h3>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            You haven't created any booking requests yet. 
            Start by creating your first booking!
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-3xl shadow hover:shadow-xl transition-all duration-300 p-8">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 text-sm font-semibold rounded-2xl ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className="text-gray-400 text-sm">Booking #{booking.id}</span>
                  </div>

                  <h3 className="text-2xl font-semibold text-gray-900 mt-4 leading-tight">
                    {booking.purpose}
                  </h3>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 text-gray-600">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs uppercase tracking-widest text-gray-500">From</div>
                        {formatDateTime(booking.startTime)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs uppercase tracking-widest text-gray-500">To</div>
                        {formatDateTime(booking.endTime)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        Resource ID: <span className="font-medium">{booking.resourceId}</span>
                        {booking.expectedAttendees && ` • ${booking.expectedAttendees} attendees`}
                      </div>
                    </div>
                  </div>
                </div>

                {(booking.rejectionReason || booking.cancellationReason) && (
                  <div className="text-sm text-red-600 max-w-xs text-right bg-red-50 p-4 rounded-2xl">
                    {booking.rejectionReason && `Rejected: ${booking.rejectionReason}`}
                    {booking.cancellationReason && `Cancelled: ${booking.cancellationReason}`}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;