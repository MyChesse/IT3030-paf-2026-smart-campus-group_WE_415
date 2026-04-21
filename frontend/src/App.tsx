import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AdminRoute, PrivateRoute } from './components/PrivateRoute';
import AppLayout from './components/AppLayout';

import LoginPage from './auth/LoginPage';
import SignupPage from './auth/SignupPage';
import ForgotPasswordPage from './auth/ForgotPasswordPage';
import ResetPasswordPage from './auth/ResetPasswordPage';
import OAuth2CallbackPage from './auth/OAuth2CallbackPage';
import ProfilePage from './auth/ProfilePage';

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

            <Route path="/resources" element={<ResourceList />} />
            <Route path="/resources/new" element={<ResourceForm />} />
            <Route path="/resources/:id" element={<ResourceDetail />} />
            <Route path="/resources/:id/edit" element={<ResourceForm />} />

            <Route path="/home" element={<Home />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/create-booking" element={<CreateBooking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin-bookings" element={<AdminBookings />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;