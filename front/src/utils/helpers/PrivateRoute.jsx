// routes/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../utils/context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
