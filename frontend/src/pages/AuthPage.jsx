import { useState } from "react";
import api from "../utils/api";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("EMAIL"); 
  // EMAIL | LOGIN | OTP | SET_PASSWORD | RESET_PASSWORD

  const checkEmail = async () => {
    try {
      const res = await api.post("/auth/check-email", { email });

      if (res.data.flow === "LOGIN") {
        setStep("LOGIN");
      } else {
        await sendOtp();
        setStep("OTP");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const login = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      alert("Login successful");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const sendOtp = async () => {
    await api.post("/auth/send-otp", { email });
  };

  const verifyOtp = async () => {
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setStep("SET_PASSWORD");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  const setPasswordFn = async () => {
    try {
      await api.post("/auth/set-password", { email, password });
      alert("Signup completed");
      setStep("LOGIN");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const forgotPassword = async () => {
    try {
      await api.post("/auth/forgot-password", { email });
      setStep("RESET_PASSWORD");
      alert("OTP sent for password reset");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const resetPassword = async () => {
    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password
      });
      alert("Password reset successful");
      setStep("LOGIN");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96 space-y-4">
        <h2 className="text-xl font-bold text-center">SmartBazar Auth</h2>

        <input
          className="w-full p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        {step === "EMAIL" && (
          <button onClick={checkEmail} className="btn w-full">Continue</button>
        )}

        {step === "LOGIN" && (
          <>
            <input
              className="w-full p-2 border rounded"
              type="password"
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
            />
            <button onClick={login} className="btn w-full">Login</button>
            <button
              onClick={forgotPassword}
              className="text-sm text-blue-500 underline"
            >
              Forgot password?
            </button>
          </>
        )}

        {step === "OTP" && (
          <>
            <input
              className="w-full p-2 border rounded"
              placeholder="Enter OTP"
              onChange={e => setOtp(e.target.value)}
            />
            <button onClick={verifyOtp} className="btn w-full">Verify OTP</button>
          </>
        )}

        {step === "SET_PASSWORD" && (
          <>
            <input
              className="w-full p-2 border rounded"
              type="password"
              placeholder="Set Password"
              onChange={e => setPassword(e.target.value)}
            />
            <button onClick={setPasswordFn} className="btn w-full">
              Complete Signup
            </button>
          </>
        )}

        {step === "RESET_PASSWORD" && (
          <>
            <input
              className="w-full p-2 border rounded"
              placeholder="OTP"
              onChange={e => setOtp(e.target.value)}
            />
            <input
              className="w-full p-2 border rounded"
              type="password"
              placeholder="New Password"
              onChange={e => setPassword(e.target.value)}
            />
            <button onClick={resetPassword} className="btn w-full">
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
