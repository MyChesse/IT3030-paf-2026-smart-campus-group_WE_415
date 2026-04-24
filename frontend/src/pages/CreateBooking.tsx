import React, { useState } from 'react';
import { bookingService } from '../services/bookingService';
import { Calendar, Clock, Users, FileText, Plus } from 'lucide-react';
import SDBookingCalendar from '../components/SDBookingCalendar';

const CreateBooking: React.FC = () => {
  const [formData, setFormData] = useState({
    resourceId: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date) => {
    // Pre-fill start time when user clicks an available slot
    const endTime = new Date(date);
    endTime.setHours(date.getHours() + 1);
    
    setFormData(prev => ({
      ...prev,
      startTime: date.toISOString().slice(0, 16),
      endTime: endTime.toISOString().slice(0, 16),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        resourceId: parseInt(formData.resourceId),
        startTime: formData.startTime,
        endTime: formData.endTime,
        purpose: formData.purpose,
        expectedAttendees: formData.expectedAttendees ? parseInt(formData.expectedAttendees) : undefined,
      };

      await bookingService.createBooking(payload);
      
      setMessage({ type: 'success', text: 'Booking request created successfully! 🎉' });
      
      setFormData({
        resourceId: '',
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: '',
      });
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to create booking. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Booking</h1>
              <p className="text-gray-600 mt-1">Request a room, lab, or equipment</p>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? '✓' : '⚠'} {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Resource ID</label>
              <input
                type="number"
                name="resourceId"
                value={formData.resourceId}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter Resource ID (e.g. 101)"
              />
              <p className="text-xs text-gray-500 mt-1">Lecture Hall: 101, 102, 103 | Labs: 201, 202 | Meeting Rooms: 301, 302</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Purpose</label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                placeholder="Describe the purpose of this booking..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Attendees (Optional)</label>
              <input
                type="number"
                name="expectedAttendees"
                value={formData.expectedAttendees}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Number of expected attendees"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
            >
              {loading ? 'Creating Booking...' : 'Submit Booking Request'}
            </button>
          </form>
        </div>

        {/* Calendar Component */}
        <div>
          <SDBookingCalendar onDateSelect={handleDateSelect} />
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;