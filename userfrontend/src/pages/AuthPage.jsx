import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("EMAIL");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // CHECK EMAIL
  const checkEmail = async () => {
if (!email) return toast.warning("Email is required ⚠️");

    try {
      setLoading(true);
      const res = await api.post("/auth/check-email", { email });

      if (res.data.flow === "LOGIN") {
        setStep("LOGIN");
      } else {
        await sendOtp();
        setStep("OTP");
      }
    } catch (error) {
toast.error(error.response?.data?.message || "Error checking email");
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const handleLogin = async () => {
if (!email || !password)
  return toast.warning("Email and password are required ⚠️");

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });

      await login(res.data.token);
      toast.success("Login successful 🎉");

      navigate("/user/profile");

      setEmail("");
      setPassword("");
    } catch (error) {
toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // SEND OTP
  const sendOtp = async () => {
    try {
      await api.post("/auth/send-otp", { email });
      toast.success("OTP sent to your email 📩");

      setStep("OTP");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  // VERIFY OTP
  const verifyOtp = async () => {
    try {
      setLoading(true);
      await api.post("/auth/verify-otp", { email, otp });
      toast.success("OTP verified successfully ✅");

      setStep("SET_PASSWORD");
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // SET PASSWORD
  const setPasswordFn = async () => {
    try {
      setLoading(true);
      await api.post("/auth/set-password", { email, password });
      toast.success("Password set successfully 🔐");

      setStep("LOGIN");
    } catch {
      toast.error("Error setting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
<div className="min-h-[calc(100vh-140px)] flex items-center justify-center 
                bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 px-4 py-10">


     <div className="w-full max-w-md bg-white 
                rounded-3xl shadow-2xl 
                p-8 space-y-6 
                transition-all duration-300">


          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r 
                           from-indigo-600 to-purple-600 
                           bg-clip-text text-transparent">
              SmartBazar
            </h2>

            <p className="text-sm text-gray-500">
              {step === "LOGIN"
                ? "Welcome back 👋"
                : "Secure authentication"}
            </p>
          </div>

          {/* Email */}
          <input
            className="w-full px-4 py-3 rounded-xl border border-gray-300
                       focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* EMAIL STEP */}
          {step === "EMAIL" && (
            <PrimaryButton onClick={checkEmail} loading={loading}>
              Continue
            </PrimaryButton>
          )}

          {/* LOGIN STEP */}
          {step === "LOGIN" && (
            <>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300
                           focus:ring-2 focus:ring-indigo-500 outline-none transition"
                onChange={(e) => setPassword(e.target.value)}
              />
              <PrimaryButton onClick={handleLogin} loading={loading}>
                Login
              </PrimaryButton>
            </>
          )}

          {/* OTP STEP */}
          {step === "OTP" && (
            <>
              <input
                placeholder="Enter OTP"
                className="w-full px-4 py-3 rounded-xl border border-gray-300
                           focus:ring-2 focus:ring-indigo-500 outline-none transition"
                onChange={(e) => setOtp(e.target.value)}
              />
              <PrimaryButton onClick={verifyOtp} loading={loading}>
                Verify OTP
              </PrimaryButton>
            </>
          )}

          {/* SET PASSWORD STEP */}
          {step === "SET_PASSWORD" && (
            <>
              <input
                type="password"
                placeholder="Set Password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300
                           focus:ring-2 focus:ring-indigo-500 outline-none transition"
                onChange={(e) => setPassword(e.target.value)}
              />
              <PrimaryButton onClick={setPasswordFn} loading={loading}>
                Complete Signup
              </PrimaryButton>
            </>
          )}

          <p
            onClick={() => navigate("/auth/forgot-password")}
            className="text-sm text-indigo-600 text-center 
                       hover:underline cursor-pointer"
          >
            Forgot Password?
          </p>

          <p className="text-center text-xs text-gray-400 pt-4">
            © 2026 SmartBazar
          </p>
        </div>
      </div>

    </>
  );
}

/* Premium Button Component */
function PrimaryButton({ children, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full py-3 rounded-xl font-semibold text-white
                  transition-all shadow-lg
                  ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
                  }`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
