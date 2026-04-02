import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AdminProtectedRoute = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  useEffect(() => {
    // ✅ Catches token change from OTHER tabs
    const handleStorage = (e) => {
      if (e.key === "adminToken") {
        const current = localStorage.getItem("adminToken");
        setToken(current);
        if (!current) window.location.replace("/admin/login");
      }
    };

    // ✅ Catches back-button (bfcache)
    const handlePageShow = (event) => {
      if (event.persisted) {
        const current = localStorage.getItem("adminToken");
        if (!current) window.location.replace("/admin/login");
      }
    };

    // ✅ Catches token change in SAME tab (manual edit / expiry)
    const interval = setInterval(() => {
      const current = localStorage.getItem("adminToken");
      if (!current) {
        window.location.replace("/admin/login");
      } else {
        // ✅ Check if JWT is expired
        try {
          const payload = JSON.parse(atob(current.split(".")[1]));
          if (payload.exp * 1000 < Date.now()) {
            localStorage.removeItem("adminToken");
            window.location.replace("/admin/login");
          }
        } catch {
          localStorage.removeItem("adminToken");
          window.location.replace("/admin/login");
        }
      }
    }, 2000); // checks every 2 seconds

    window.addEventListener("storage", handleStorage);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("pageshow", handlePageShow);
      clearInterval(interval);
    };
  }, []);

  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

export default AdminProtectedRoute;