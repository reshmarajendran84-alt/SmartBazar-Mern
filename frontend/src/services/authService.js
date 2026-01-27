import { response } from "express";
import api from "../utils/api";
export const login =async(data)=>{
    const reponse = await api.post("/auth/login",data);
    return reponse.data;
};
const checkEmail = async () => {
  const res = await api.post("/auth/check-email", { email });

  if (res.data.flow === "LOGIN") {
    setStep("login");
  } else {
    await api.post("/auth/send-otp", { email });
    setStep("otp");
  }
};

const verifyOtp = async () => {
  try {
    await api.post("/auth/verify-otp", { email, otp });
    alert("OTP verified");
    setStep("setPassword");
  } catch (err) {
    alert(err.response?.data?.message);
  }
};
const setUserPassword = async () => {
  try {
    await api.post("/auth/set-password", {
      email,
      password
    });
    alert("Signup completed. Please login.");
    setStep("login");
  } catch (err) {
    alert(err.response?.data?.message);
  }
};
const login = async () => {
  try {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    alert("Login success");
  } catch (err) {
    alert(err.response?.data?.message);
  }
};
