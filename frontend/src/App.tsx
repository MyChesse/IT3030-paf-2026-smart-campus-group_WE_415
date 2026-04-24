import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Facilities from './pages/Facilities'; // Import Facilities page
import FacilitiesOverview from './pages/FacilitiesOverview';
import AdminDashboard from './pages/AdminDashboard'; // Import AdminDashboard page
import AdminDashboardFacility from './pages/AdminDashboardFacility';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/facilities-overview" element={<FacilitiesOverview />} />
        <Route path="/facilities" element={<Facilities />} /> {/* Add Facilities route */}
        <Route path="/admin" element={<AdminDashboard />} /> {/* Add AdminDashboard route */}
        <Route path="/admin/facility-catalogue" element={<AdminDashboardFacility />} />
      </Routes>
    </Router>
  );
}

export default App;