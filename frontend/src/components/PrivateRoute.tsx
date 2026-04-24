import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PrivateRoute() {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return <div className="loading-spinner">Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}

export function AdminRoute() {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

export function AdminOrTechnicianRoute() {
  const { loading, isAuthenticated, isAdmin, isTechnician } = useAuth();

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return isAdmin || isTechnician ? <Outlet /> : <Navigate to="/tickets/my" replace />;
}
