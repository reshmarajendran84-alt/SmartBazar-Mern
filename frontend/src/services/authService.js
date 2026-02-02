import api from "../utils/api";

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const checkEmail = async (email) => {
  const response = await api.post("/auth/check-email", { email });
  return response.data; 
 
};
// Send signup OTP
export const sendSignupOtp = async (email) => {
  const response = await api.post("/auth/send-otp", { email });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await api.post("/auth/verify-otp", { email, otp });
  return response.data;
};

export const setUserPassword = async (email, password) => {
  const response = await api.post("/auth/set-password", {
    email,
    password,
  });
  return response.data;
};

export const login = async (email,password) => {
  try {
    const res = await api.post("/auth/login", { email,password });
    localStorage.setItem("token", res.data.token);
    alert("Login success");
  } catch (err) {
    alert(err.response?.data?.message);
  }
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};
export const resetPassword = async (email, otp, newPassword) => {
  const response = await api.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
  });
  return response.data;
};