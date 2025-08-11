import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../utils/context/AuthContext";

const PrivateRouterAdmin = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRouterAdmin;
