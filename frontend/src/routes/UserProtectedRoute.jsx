import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserProtectedRoute = () => {
  const { user, loading } = useAuth();
console.log(user);
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  return <Outlet />;
};

export default UserProtectedRoute;
