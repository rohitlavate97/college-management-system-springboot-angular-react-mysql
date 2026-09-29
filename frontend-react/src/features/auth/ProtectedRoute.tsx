import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = () => {
  const { token } = useAuth() as any;
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
