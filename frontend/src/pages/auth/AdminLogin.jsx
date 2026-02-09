import { useState } from "react";
import adminApi from "../../utils/adminApi";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
   
const res = await adminApi.post("/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);

      
      navigate("/users");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-linear-to-br from-indigo-600 via-violet-600 to-purple-600 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">SmartBazar Admin</h2>
          <p className="text-sm text-gray-500">Secure admin access 🔐</p>
        </div>

        <input
          className="w-full px-4 py-3 rounded-lg border border-gray-300
                     focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg border border-gray-300
                     focus:ring-2 focus:ring-indigo-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full py-3 rounded-lg font-semibold text-white
                     bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md"
        >
          Admin Login
        </button>

        <p className="text-center text-xs text-gray-400 pt-4">
          © 2026 SmartBazar
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;