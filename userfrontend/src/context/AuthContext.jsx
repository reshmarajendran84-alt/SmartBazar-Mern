// /* eslint-disable react-refresh/only-export-components */
// import { createContext, useContext, useEffect, useState, useCallback } from "react";
// import api from "../utils/api";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const logout = useCallback(() => {
//     localStorage.removeItem("token");
//     setUser(null);
//     setLoading(false);
//   }, []);

//   const loadProfile = useCallback(async (signal) => {
//     try {
//       const res = await api.get("/user/profile",{ signal });
//       console.log("PROFILE:", res.data);
//       setUser(res.data);
//     } catch (err) {
//       // if(api.isCancel(err))
//         // return;
// if (err.name === "CanceledError") return;

//       console.error("PROFILE ERROR:", err.response?.data || err.message);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   }, [logout]);

//   const login = async (token) => {
//     console.log("token",token);
//     localStorage.setItem("token", token);
//     setLoading(true);
//     const controller =new AbortController();
//     await loadProfile(controller.signal); 
//   };

//   useEffect(() => {
// console.log("AUTH USER:", user);
// const controller =new AbortController();

// const token =localStorage.getItem("token");
//     if (token) {
//       loadProfile(controller.signal);
//     } else {
//       setLoading(false);
//     }
//     return()=>controller.abort();
//   }, [loadProfile]);

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
  }, []);

  const loadProfile = useCallback(async (signal) => {
    try {
      const res = await api.get("/user/profile", { signal });
      setUser(res.data);
    } catch (err) {
      if (err.name === "CanceledError") return;
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // ✅ login() ONLY saves token + loads profile — cart merge is CartContext's job
  const login = async (token) => {
    localStorage.setItem("token", token);
    setLoading(true);
    const controller = new AbortController();
    await loadProfile(controller.signal);
    // ❌ NO cart merge here — AuthPage calls mergeOnLogin() after this
  };

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("token");
    if (token) loadProfile(controller.signal);
    else setLoading(false);
    return () => controller.abort();
  }, [loadProfile]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);