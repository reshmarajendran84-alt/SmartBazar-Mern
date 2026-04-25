export const logout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.clear();

  window.history.pushState(null, "", "/auth/login");
  window.onpopstate = () => {
    window.history.pushState(null, "", "/auth/login");
  };

  window.location.replace("/auth/login");
};