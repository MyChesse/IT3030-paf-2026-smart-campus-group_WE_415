import React, { useState } from 'react';
import { bookingService } from '../services/bookingService';
import { Plus } from 'lucide-react';
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
    <div className="booking-create-page">
      <div className="booking-create-grid">
        {/* Booking Form */}
        <div className="booking-form-panel">
          <div className="booking-form-header">
            <div className="booking-form-icon">
              <Plus className="w-8 h-8" />
            </div>
            <div>
              <h1 className="booking-form-title">Create New Booking</h1>
              <p className="booking-form-subtitle">Request a room, lab, or equipment</p>
            </div>
          </div>

          {message && (
            <div className={`booking-form-alert ${
              message.type === 'success'
                ? 'booking-form-alert--success'
                : 'booking-form-alert--error'
            }`}>
              {message.type === 'success' ? '✓' : '⚠'} {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="booking-theme-form">
            <div>
              <label className="booking-field-label">Resource ID</label>
              <input
                type="number"
                name="resourceId"
                value={formData.resourceId}
                onChange={handleChange}
                required
                className="booking-field-input"
                placeholder="Enter Resource ID (e.g. 101)"
              />
              <p className="booking-field-help">Lecture Hall: 101, 102, 103 | Labs: 201, 202 | Meeting Rooms: 301, 302</p>
            </div>

            <div className="booking-field-grid">
              <div>
                <label className="booking-field-label">Start Time</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="booking-field-input"
                />
              </div>

              <div>
                <label className="booking-field-label">End Time</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="booking-field-input"
                />
              </div>
            </div>

            <div>
              <label className="booking-field-label">Purpose</label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                rows={4}
                className="booking-field-input booking-field-textarea"
                placeholder="Describe the purpose of this booking..."
              />
            </div>

            <div>
              <label className="booking-field-label">Expected Attendees (Optional)</label>
              <input
                type="number"
                name="expectedAttendees"
                value={formData.expectedAttendees}
                onChange={handleChange}
                className="booking-field-input"
                placeholder="Number of expected attendees"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="booking-submit-btn"
            >
              {loading ? 'Creating Booking...' : 'Submit Booking Request'}
            </button>
          </form>
        </div>

        {/* Calendar Component */}
        <div className="booking-calendar-wrap">
          <SDBookingCalendar onDateSelect={handleDateSelect} />
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;