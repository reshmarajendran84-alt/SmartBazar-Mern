import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token =
    role === "admin"
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("token");

  if (!token) {
    return <Navigate to={role === "admin" ? "/admin/login" : "/"} />;
  }

  return children;
}
