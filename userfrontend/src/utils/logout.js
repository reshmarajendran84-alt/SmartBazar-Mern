export const logout = () => {
  //  Clear all stored data
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.clear();

  //  Block back button from returning to protected page
  window.history.pushState(null, "", "/auth/login");
  window.onpopstate = () => {
    window.history.pushState(null, "", "/auth/login");
  };

  //  Correct route path matching your App.jsx
  window.location.replace("/auth/login");
};