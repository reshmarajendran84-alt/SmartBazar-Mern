/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const res = await api.get("/user/profile");
      console.log("PROFILE:", res.data);
      setUser(res.data);
    } catch (err) {
      console.error("PROFILE ERROR:", err.response?.data || err.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const login = async (token) => {
    console.log("token",token);
    localStorage.setItem("token", token);
    setLoading(true);
    await loadProfile(); 
  };

  useEffect(() => {
console.log("AUTH USER:", user);

    if (localStorage.getItem("token")) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, []);
if (loading) return <p>Loading...</p>;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
