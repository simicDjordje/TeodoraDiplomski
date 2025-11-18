import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import OrgLogin from '../pages/OrgLogin';
import Dashboard from '../pages/Dashboard';
import Events from '../pages/Events';
import EventDetail from '../pages/EventDetail';
import CreateEvent from '../pages/CreateEvent';
import MyApplications from '../pages/MyApplications';
import Organisations from '../pages/Organisations';
import OrganisationDetail from '../pages/OrganisationDetail';
import RegisterOrg from '../pages/RegisterOrg';
import Profile from '../pages/Profile';
import OrgApplications from '../pages/OrgApplications';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-default-500">Učitavanje...</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const UserOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-default-500">Učitavanje...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if ((user as any)?.role !== 'user') {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const OrgOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-default-500">Učitavanje...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/org/login" />;
  }

  if ((user as any)?.role !== 'organisation') {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-default-500">Učitavanje...</div>
      </div>
    );
  }

  // Ako je korisnik već ulogovan, redirect na dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/org/login"
        element={
          <PublicOnlyRoute>
            <OrgLogin />
          </PublicOnlyRoute>
        }
      />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route
        path="/events/create"
        element={
          <OrgOnlyRoute>
            <CreateEvent />
          </OrgOnlyRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <UserOnlyRoute>
            <MyApplications />
          </UserOnlyRoute>
        }
      />
      <Route path="/organisations" element={<Organisations />} />
      <Route path="/organisations/:username" element={<OrganisationDetail />} />
      <Route path="/org/register" element={<RegisterOrg />} />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/org/applications"
        element={
          <OrgOnlyRoute>
            <OrgApplications />
          </OrgOnlyRoute>
        }
      />
      <Route
        path="/events/:eventId/applications"
        element={
          <OrgOnlyRoute>
            <OrgApplications />
          </OrgOnlyRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
