import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Children } from "react";

const UserProtectedRoute = ({children}) => {
  const { user, loading } = useAuth();
console.log(user);
  if (loading) return <p>Checking session...</p>;
  if (!user) return <Navigate to="/auth/login" />;

  return children;
};

export default UserProtectedRoute;
