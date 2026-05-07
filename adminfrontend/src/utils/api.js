import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL || "http://localhost:5000/api/admin",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token && config.url !== "/login") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      sessionStorage.clear();
      window.location.replace("/admin/login");
    }
    return Promise.reject(error);
  }
);

export default api;