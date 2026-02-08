/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import userApi from "../utils/userApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

const loadProfile = useCallback(async () => {
  try {
    const res = await userApi.get("/profile");
    setUser(res.data);
  } catch {
    logout();
  } finally {
    setLoading(false);
  }
}, [logout]);

  const login = (token) => {
  localStorage.setItem("token", token);
  setUser({token});
  loadProfile();
};

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [loadProfile]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);