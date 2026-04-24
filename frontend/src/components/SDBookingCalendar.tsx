import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { bookingService, type Booking, type Resource } from '../services/bookingService';
import { Calendar as CalendarIcon, Loader2, X, Clock, AlertCircle } from 'lucide-react';

interface SDBookingCalendarProps {
  onDateSelect?: (date: Date) => void;
}

const SDBookingCalendar: React.FC<SDBookingCalendarProps> = ({ onDateSelect }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Booking | null>(null);
  const [selectedResource, setSelectedResource] = useState<string>('all');

  // Fetch all bookings (required) + resources (optional)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch bookings (always needed)
        let bookingsData = await bookingService.getAllBookings();
        // Handle possible wrapper object
        if (bookingsData && typeof bookingsData === 'object' && 'data' in bookingsData) {
          bookingsData = (bookingsData as any).data;
        }
        if (!Array.isArray(bookingsData)) bookingsData = [];
        setBookings(bookingsData);
        
        // 2. Try to fetch resources, but don't break if it fails
        try {
          let resourcesData = await bookingService.getResources();
          if (resourcesData && typeof resourcesData === 'object' && 'data' in resourcesData) {
            resourcesData = (resourcesData as any).data;
          }
          if (Array.isArray(resourcesData)) {
            setResources(resourcesData);
          }
        } catch (resourceErr) {
          console.warn('Could not fetch resources, using IDs only:', resourceErr);
          setResources([]);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Transform bookings into calendar events
  const getCalendarEvents = () => {
    let filteredBookings = bookings;
    if (selectedResource !== 'all') {
      filteredBookings = bookings.filter(b => b.resourceId.toString() === selectedResource);
    }

    return filteredBookings.map(booking => {
      const resource = resources.find(r => r.id === booking.resourceId);
      // Display: "Lecture Hall 101 - APPROVED" or "Resource 101 - PENDING"
      const resourceDisplay = resource?.name || `Resource ${booking.resourceId}`;
      
      const statusColors: Record<string, string> = {
        APPROVED: '#10b981', // Green
        PENDING: '#f59e0b',  // Orange
        REJECTED: '#ef4444', // Red
        CANCELLED: '#6b7280' // Gray
      };
      const color = statusColors[booking.status] || '#3b82f6';

      return {
        id: String(booking.id),
        title: `${resourceDisplay} - ${booking.status}`,
        start: booking.startTime,
        end: booking.endTime,
        backgroundColor: color,
        borderColor: color,
        extendedProps: { booking, resource }
      };
    });
  };

  // Available time slots (only shows free slots based on APPROVED bookings)
  const getAvailableTimeSlots = () => {
    const slots = [];
    const today = new Date();
    const startHour = 8;
    const endHour = 20;

    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = new Date(today);
      startTime.setHours(hour, 0, 0, 0);
      const endTime = new Date(today);
      endTime.setHours(hour + 1, 0, 0, 0);

      const isBooked = bookings.some(booking => {
        if (selectedResource !== 'all' && booking.resourceId.toString() !== selectedResource) return false;
        // Only approved bookings block the slot
        if (booking.status !== 'APPROVED') return false;
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
        return startTime < bookingEnd && endTime > bookingStart;
      });

      if (!isBooked) {
        slots.push({
          startTime,
          endTime,
          displayTime: `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        });
      }
    }
    return slots;
  };

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event.extendedProps.booking);
  };

  const handleDateSelect = (info: any) => {
    if (onDateSelect) onDateSelect(info.start);
  };

  if (loading) {
    return (
      <div className="booking-calendar-panel flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="ml-3 text-gray-600">Loading calendar...</p>
      </div>
    );
  }

  const availableSlots = getAvailableTimeSlots();

  // Unique resource IDs for filter (if resources not loaded, use from bookings)
  const uniqueResourceIds = [...new Set(bookings.map(b => b.resourceId))];
  const hasResources = resources.length > 0;

  return (
    <div className="booking-calendar-panel overflow-hidden">
      <div className="booking-calendar-panel__header px-6 py-5">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-7 h-7 text-white" />
          <h2 className="text-xl font-bold text-white">Resource Booking Calendar</h2>
        </div>
        <p className="text-blue-100 text-sm mt-1">View all bookings and available slots</p>
      </div>

      {/* Resource Filter */}
      <div className="booking-calendar-filter p-5">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-semibold text-gray-700">Filter by Resource:</label>
          <select
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
            className="booking-calendar-select px-4 py-2 border border-gray-300 rounded-xl bg-white text-sm"
          >
            <option value="all">All Resources</option>
            {hasResources ? (
              resources.map(res => (
                <option key={res.id} value={res.id}>{res.name} - {res.type}</option>
              ))
            ) : (
              uniqueResourceIds.map(id => (
                <option key={id} value={id}>Resource #{id}</option>
              ))
            )}
          </select>

          <div className="booking-calendar-legend flex gap-3 ml-auto">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-xs">Approved</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-orange-500"></div><span className="text-xs">Pending</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs">Rejected</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-500"></div><span className="text-xs">Cancelled</span></div>
          </div>
        </div>
      </div>

      <div className="p-5 booking-calendar-theme">
        {/* FullCalendar */}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="timeGridWeek"
          editable={false}
          selectable={true}
          events={getCalendarEvents()}
          eventClick={handleEventClick}
          select={handleDateSelect}
          height="auto"
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          nowIndicator={true}
          businessHours={{ daysOfWeek: [1,2,3,4,5], startTime: '08:00', endTime: '20:00' }}
        />

        {/* Available Slots */}
        <div className="mt-6 pt-5 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            Available Time Slots for Today
          </h3>
          {availableSlots.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-center">
              <AlertCircle className="w-10 h-10 text-yellow-600 mx-auto mb-2" />
              <p className="text-yellow-800 font-medium">No free slots available for today</p>
              <p className="text-yellow-600 text-sm">Try selecting a different resource or date</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableSlots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => onDateSelect?.(slot.startTime)}
                  className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl p-3 text-center transition"
                >
                  <span className="text-green-700 font-semibold text-sm">{slot.displayTime}</span>
                  <span className="text-green-500 text-xs block mt-0.5">Available</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold">Booking Details</h3>
              <button onClick={() => setSelectedEvent(null)} className="p-1.5 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><p className="text-xs text-gray-500">Resource</p><p className="font-semibold">Resource #{selectedEvent.resourceId}</p></div>
              <div><p className="text-xs text-gray-500">Time Slot</p><p className="font-semibold">{new Date(selectedEvent.startTime).toLocaleString()} - {new Date(selectedEvent.endTime).toLocaleTimeString()}</p></div>
              <div><p className="text-xs text-gray-500">Purpose</p><p className="font-medium">{selectedEvent.purpose}</p></div>
              {selectedEvent.expectedAttendees && <div><p className="text-xs text-gray-500">Expected Attendees</p><p>{selectedEvent.expectedAttendees}</p></div>}
              <div><p className="text-xs text-gray-500">Status</p>
                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${
                  selectedEvent.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  selectedEvent.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  selectedEvent.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}>{selectedEvent.status}</span>
              </div>
            </div>
            <div className="p-5 border-t bg-gray-50 rounded-b-2xl">
              <button onClick={() => setSelectedEvent(null)} className="w-full py-2.5 bg-blue-600 text-white rounded-xl">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SDBookingCalendar;