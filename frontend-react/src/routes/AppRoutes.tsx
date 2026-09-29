import { Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/features/auth/LoginPage';
import { AppLayout } from '@/layouts/AppLayout';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { Dashboard } from '@/features/dashboard/Dashboard';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};
