import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext"; 

const UserProtectedRoute = () => {
  const { user, token } = useAuth(); 

  // bfcache — back button after logout
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        // Page loaded from back button cache
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          window.location.replace("/auth/login");
        }
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // ✅ If no token, redirect to correct login route
  if (!token && !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default UserProtectedRoute;