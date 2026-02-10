import { useState } from "react";
import api  from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("EMAIL"); // EMAIL | RESET
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email) return alert("Please enter your email");
    try {
await api.post("/auth/forgot-password", { email });
      alert("OTP sent to your email");
      setStep("RESET");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    }
    console.log(otp);
  };

  const resetPassword = async () => {
    if (!otp || !newPassword)
      return alert("OTP and new password required");

    try {
await api.post("/auth/reset-password", { email, otp, newPassword });

      alert("Password reset successful");
      navigate("/");
    } catch (err) {
      console.log("RESET ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Reset failed");
    }
    console.log(resetPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
          <p className="text-sm text-gray-500">
            {step === "EMAIL"
              ? "Enter your email to receive OTP"
              : "Enter OTP and new password"}
          </p>
        </div>

        {step === "EMAIL" && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border"
          />
        )}

        {step === "RESET" && (
          <>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border"
            />
          </>
        )}

        <button
          onClick={step === "EMAIL" ? sendOtp : resetPassword}
          className="w-full py-3 rounded-lg text-white bg-indigo-600"
        >
          {step === "EMAIL" ? "Send OTP" : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
