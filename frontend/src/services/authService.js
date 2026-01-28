import { response } from "express";
import api from "../utils/api";

export const login =async(data)=>{
    const reponse = await api.post("/auth/login",data);
    return reponse.data;
};
export const checkEmail = async (email) => {
  const response = await api.post("/auth/check-email", { email });
  if (res.data.flow === "LOGIN") {
    setStep("login");
  } else {
    await api.post("/auth/send-otp", { email });
    setStep("otp");
  }
    return response.data;

};
// Send signup OTP
export const sendSignupOtp = async (email) => {
  const response = await api.post("/auth/send-otp", { email });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  try {
    await api.post("/auth/verify-otp", { email, otp });
    alert("OTP verified");
    setStep("setPassword");
  } catch (err) {
    alert(err.response?.data?.message);
  }
};
export const setUserPassword = async (email, password) => {
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
export const login = async () => {
  try {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    alert("Login success");
  } catch (err) {
    alert(err.response?.data?.message);
  }
};
