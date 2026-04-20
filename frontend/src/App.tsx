import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import CreateBooking from './pages/CreateBooking';
import MyBookings from './pages/MyBookings';
import AdminBookings from './pages/AdminBookings';

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
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;