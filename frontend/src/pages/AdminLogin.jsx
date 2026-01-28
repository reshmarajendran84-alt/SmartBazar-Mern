import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const res = await api.post("/admin/login", { email, password });
    localStorage.setItem("adminToken", res.data.token);
    navigate("/admin/dashboard");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 w-96 rounded space-y-4">
        <h2 className="text-xl font-bold text-center">Admin Login</h2>
        <input className="input" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button className="btn w-full" onClick={login}>Login</button>
      </div>
    </div>
  );
}
