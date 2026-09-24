import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OwnerRoute = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "OWNER") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default OwnerRoute;
