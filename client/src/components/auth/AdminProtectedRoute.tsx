import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const AdminProtectedRoute = () => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" />;
  }
  
  return <Outlet />;
};

export default AdminProtectedRoute;