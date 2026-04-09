import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) return <Navigate to="/admin/login" replace />;

  // Check expiry once on render
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("adminToken");
      return <Navigate to="/admin/login" replace />;
    }
  } catch {
    localStorage.removeItem("adminToken");
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;