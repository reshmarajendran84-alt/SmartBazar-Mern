import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const UserProtectedRoute = () => {
  const { user, loading } = useAuth(); // ✅ use loading, not token

  // bfcache — back button after logout
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          window.location.replace("/auth/login");
        }
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 animate-pulse">Loading...</p>
    </div>
  ); // ✅ wait for auth check to finish

  if (!user) return <Navigate to="/auth/login" replace />;

  return <Outlet />;
};

export default UserProtectedRoute;