import { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("EMAIL");
  const navigate = useNavigate();
const { login } = useAuth();

const checkEmail = async () => {
  if (!email) {
    alert("Email is required");
    return;
  }

  try {
    const res = await api.post("/auth/check-email", { email });

    if (res.data.flow === "LOGIN") {
      setStep("LOGIN");
    } else {
      await sendOtp(); 
      setStep("OTP");
    }
  } catch (error) {
    alert(error.response?.data?.message || "Error checking email");
  }
};
const handleLogin = async () => {
  if (!email || !password) {
    alert("Email and password are required");
    return;
  }

  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });
console.log(email,password);
    await login(res.data.token);

    navigate("/user/profile");
    console.log("TOKEN FROM LOGIN:", res.data.token);
setEmail("");
setPassword("");
  } catch (error) {
    alert(error.response?.data?.message || "Login failed");
  }
};

const sendOtp = async () => {
  if (!email) {
    return;
  }

  try {
    await api.post("/auth/send-otp", { email });
    setStep("OTP");
      

  } catch (error) {
    alert(error.response?.data?.message || "Failed to send OTP");
  }
    console.log(otp);
};


  const verifyOtp = async () => {
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setStep("SET_PASSWORD");
    } catch {
      alert("Invalid OTP");
    }
  };

  const setPasswordFn = async () => {
    try {
      await api.post("/auth/set-password", { email, password });
      setStep("LOGIN");
           

    } catch {
      alert("Error");
    }
     console.log(email,password)
  };

 
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 via-violet-600 to-purple-600 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">samrtBazar</h2>
          <p className="text-sm text-gray-500">
            {step === "LOGIN" ? "Welcome back 👋" : "Secure authentication"}
          </p>
        </div>



        {/* Email */}
        <input
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        {step === "EMAIL" && <PrimaryButton onClick={checkEmail}>Continue</PrimaryButton>}

        {step === "LOGIN" && (
          <>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={e => setPassword(e.target.value)}
            />
<PrimaryButton onClick={handleLogin}>Login</PrimaryButton>
          </>
        )}

        {step === "OTP" && (
          <>
            <input
              placeholder="Enter OTP"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={e => setOtp(e.target.value)}
            />
            <PrimaryButton onClick={verifyOtp}>Verify OTP</PrimaryButton>
          </>
        )}

        {step === "SET_PASSWORD" && (
          <>
            <input
              type="password"
              placeholder="Set Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={e => setPassword(e.target.value)}
            />
            <PrimaryButton onClick={setPasswordFn}>Complete Signup</PrimaryButton>
          </>
        )}
<p
          onClick={() => navigate("/auth/forgot-password")}
          className="text-sm text-blue-500 text-center underline cursor-pointer"
        >
          Forgot Password?
        </p>
        <p className="text-center text-xs text-gray-400 pt-4">© 2026 SmartBazar</p>
      </div>
    </div>
  );
}

/* Button */
function PrimaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-lg font-semibold text-white
                 bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md"
    >
      {children}
    </button>
  );
}