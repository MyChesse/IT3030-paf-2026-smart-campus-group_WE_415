import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Facilities from './pages/Facilities'; // Import Facilities page
import AdminDashboard from './pages/AdminDashboard'; // Import AdminDashboard page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/facilities" element={<Facilities />} /> {/* Add Facilities route */}
        <Route path="/admin" element={<AdminDashboard />} /> {/* Add AdminDashboard route */}
      </Routes>
    </Router>
  );
}

export default App;