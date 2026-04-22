import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import CreateBooking from './pages/CreateBooking';
import MyBookings from './pages/MyBookings';
import AdminBookings from './pages/AdminBookings';
import CreateIncidentTicketPage from './pages/tickets/CreateIncidentTicketPage';
import MyTicketsPage from './pages/tickets/MyTicketsPage';
import TicketDetailsPage from './pages/tickets/TicketDetailsPage';
import AdminOrTechnicianTicketsPage from './pages/tickets/AdminOrTechnicianTicketsPage';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        
        <div className="flex-1 ml-72">
          <Header />
          
          <main className="p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-booking" element={<CreateBooking />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/admin" element={<AdminBookings />} />
              <Route path="/tickets/create" element={<CreateIncidentTicketPage />} />
              <Route path="/tickets/my" element={<MyTicketsPage />} />
              <Route path="/tickets/:id" element={<TicketDetailsPage />} />
              <Route path="/admin/tickets" element={<AdminOrTechnicianTicketsPage />} />
              <Route path="/technician/tickets" element={<AdminOrTechnicianTicketsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;