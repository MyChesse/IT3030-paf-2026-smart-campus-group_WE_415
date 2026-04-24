import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AdminOrTechnicianRoute, AdminRoute, PrivateRoute } from './components/PrivateRoute';
import AppLayout from './components/AppLayout';

import LoginPage from './auth/LoginPage';
import SignupPage from './auth/SignupPage';
import ForgotPasswordPage from './auth/ForgotPasswordPage';
import ResetPasswordPage from './auth/ResetPasswordPage';
import OAuth2CallbackPage from './auth/OAuth2CallbackPage';
import ProfilePage from './auth/ProfilePage';

import Facilities from './pages/Facilities';
import FacilitiesOverview from './pages/FacilitiesOverview';
import AdminDashboard from './pages/AdminDashboard';
import AdminDashboardFacility from './pages/AdminDashboardFacility';

import DashboardPage from './DashboardPage';
import NotificationsPage from './notifications/NotificationsPage';
import AdminPage from './admin/AdminPage';

import ResourceList from './resources/ResourceList';
import ResourceForm from './resources/ResourceForm';
import ResourceDetail from './resources/ResourceDetail';

import Home from './pages/Home';
import CreateBooking from './pages/CreateBooking';
import MyBookings from './pages/MyBookings';
import AdminBookings from './pages/AdminBookings';

import CreateIncidentTicketPage from './pages/tickets/CreateIncidentTicketPage';
import MyTicketsPage from './pages/tickets/MyTicketsPage';
import TicketDetailsPage from './pages/tickets/TicketDetailsPage';
import AdminOrTechnicianTicketsPage from './pages/tickets/AdminOrTechnicianTicketsPage';

function ProtectedLayout() {
  return (
    <NotificationProvider>
      <AppLayout />
    </NotificationProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/facilities-overview" element={<FacilitiesOverview />} />
            <Route path="/facilities" element={<Facilities />} />

            <Route path="/resources" element={<ResourceList />} />
            <Route path="/resources/new" element={<ResourceForm />} />
            <Route path="/resources/:id" element={<ResourceDetail />} />
            <Route path="/resources/:id/edit" element={<ResourceForm />} />

            <Route path="/home" element={<Home />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/create-booking" element={<CreateBooking />} />
            <Route path="/my-bookings" element={<MyBookings />} />

            <Route path="/tickets" element={<MyTicketsPage />} />
            <Route path="/tickets/create" element={<CreateIncidentTicketPage />} />
            <Route path="/tickets/my" element={<MyTicketsPage />} />
            <Route path="/tickets/:id" element={<TicketDetailsPage />} />

            <Route element={<AdminOrTechnicianRoute />}>
              <Route path="/technician/tickets" element={<AdminOrTechnicianTicketsPage />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminPage />} />
              <Route path="/admin/facility-catalogue" element={<AdminDashboardFacility />} />
              <Route path="/admin-bookings" element={<AdminBookings />} />
              <Route path="/admin/tickets" element={<AdminOrTechnicianTicketsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;