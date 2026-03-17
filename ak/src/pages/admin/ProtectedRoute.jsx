/**
 * @component ProtectedRoute
 * @description Redirige vers /admin/login si l'utilisateur n'est pas authentifié.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuth } = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
