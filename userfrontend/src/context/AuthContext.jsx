import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/user/profile");
      setUser(res.data);
    } catch (err) {
      console.error("Profile load failed:", err.response?.status);
      // If token is invalid, clear it
      if (err.response?.status === 401 || err.response?.status === 404) {
        localStorage.removeItem("token");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (token,userData) => {
    localStorage.setItem("token", token);
      if (userData) {
    setUser(userData);
    setLoading(false);
  } else {
    setLoading(true);
    await loadProfile();
  }
  };

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, token: localStorage.getItem("token") }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);