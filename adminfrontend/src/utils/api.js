import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

// ✅ Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token && config.url !== "/login") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Auto redirect on expired token (401)
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