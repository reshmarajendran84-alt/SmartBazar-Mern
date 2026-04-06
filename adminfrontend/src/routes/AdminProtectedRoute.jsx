import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AdminProtectedRoute = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "adminToken") {
        const current = localStorage.getItem("adminToken");
        setToken(current);
        if (!current) window.location.replace("/admin/login");
      }
    };

    const handlePageShow = (event) => {
      if (event.persisted) {
        const current = localStorage.getItem("adminToken");
        if (!current) window.location.replace("/admin/login");
      }
    };

    const interval = setInterval(() => {
      const current = localStorage.getItem("adminToken");
      if (!current) {
        window.location.replace("/admin/login");
      } else {
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
    }, 2000); 

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