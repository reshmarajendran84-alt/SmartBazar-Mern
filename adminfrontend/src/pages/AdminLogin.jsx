import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    try {
      setLoading(true);
      const res = await api.post("/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      toast.success("Login successful");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 px-4 py-10">

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-6">

        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            SmartBazar Admin
          </h2>
          <p className="text-sm text-neutral-500">
            Secure admin access
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
            transition"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
            transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            onClick={login}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white 
            bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Admin Login"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-400 pt-2">
          © 2026 SmartBazar
        </p>

      </div>
    </div>
  );
};

export default AdminLogin;