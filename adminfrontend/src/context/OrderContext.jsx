import React, { createContext, useState, useContext, useCallback } from "react";

const AdminOrderContext = createContext();

export const useAdminOrders = () => {
  const context = useContext(AdminOrderContext);
  if (!context) {
    throw new Error("useAdminOrders must be used within AdminOrderProvider");
  }
  return context;
};

const BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
});

export const AdminOrderProvider = ({ children }) => {
  const [orders, setOrders]   = useState([]);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [filter, setFilter]   = useState("All");
  const [search, setSearch]   = useState("");

  const fetchOrders = useCallback(async (status, searchTerm) => {
    try {
      setLoading(true);
      setError(null);

      if (!BASE_URL) throw new Error("VITE_API_URL is not defined in .env");

      const params = new URLSearchParams();

      if (status && status !== "All") params.set("status", status);
      if (searchTerm) params.set("search", searchTerm);

      const url = `${BASE_URL}/api/admin/orders${params.size ? `?${params}` : ""}`;

      const response = await fetch(url, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      setOrders(data.orders ?? data ?? []);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      if (!BASE_URL) throw new Error("VITE_API_URL is not defined in .env");

      const response = await fetch(`${BASE_URL}/api/admin/orders/stats`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Fetch stats error:", err);
      setError(err.message || "Failed to fetch stats");
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    const response = await fetch(`${BASE_URL}/api/admin/orders/${orderId}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) throw new Error(`Update failed: ${response.status}`);

    setOrders(prev =>
      prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
    );
  }, []);

  const value = {
    orders, stats, loading, error,
    filter, search, setFilter, setSearch,
    fetchOrders, fetchStats,
    updateOrderStatus,
  };

  return (
    <AdminOrderContext.Provider value={value}>
      {children}
    </AdminOrderContext.Provider>
  );
};