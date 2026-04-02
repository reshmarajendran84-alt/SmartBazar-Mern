// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const UserProtectedRoute = () => {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   if (loading) return <p className="text-center mt-10">Checking session...</p>;

//   if (!user) {
//     return <Navigate to="/auth/login" state={{ from: location }} replace />;
//   }

//   return <Outlet />;
// };

// export default UserProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // adjust path

const UserProtectedRoute = () => {
  const { user, token } = useAuth(); // use your actual auth context values

  // ✅ Fix bfcache — back button after logout
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