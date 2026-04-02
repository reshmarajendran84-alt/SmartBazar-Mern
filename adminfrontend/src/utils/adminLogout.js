// src/utils/adminLogout.js
export const adminLogout = () => {
  localStorage.removeItem("adminToken");
  sessionStorage.clear();

  // ✅ Prevent back button returning to admin panel
  window.history.pushState(null, "", "/admin/login");
  window.onpopstate = () => {
    window.history.pushState(null, "", "/admin/login");
  };

  window.location.replace("/admin/login");
};