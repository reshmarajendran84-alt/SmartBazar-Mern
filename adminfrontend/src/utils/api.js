import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const url = config.url || "";

    // Admin routes
    if (url.startsWith("/admin")) {
      const adminToken = localStorage.getItem("adminToken");
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    }
    // User routes
    else {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR (TOKEN EXPIRED HANDLING)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;

      if (path.startsWith("/admin")) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      } else {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
