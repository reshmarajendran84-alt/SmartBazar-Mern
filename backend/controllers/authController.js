import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import hashPassword from "../utils/hashPassword.js";
import generateOTP from "../utils/generateOTP.js";

/* ================= CHECK EMAIL & DECIDE FLOW ================= */
/*
UI calls this first
*/
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user && user.isVerified && user.password) {
      return res.json({ flow: "LOGIN" });
    }

    return res.json({ flow: "SIGNUP" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= SEND OTP FOR SIGNUP ================= */
export const sendSignupOtp = async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ email });

  if (user && user.isVerified) {
    return res.status(400).json({ message: "User already verified" });
  }

  if (!user) {
    user = await User.create({ email });
  }

  if (user.otpLastSent && Date.now() - user.otpLastSent < 30000) {
    return res.status(429).json({
      message: "Please wait 30 seconds before resending OTP",
    });
  }

  user.otp = generateOTP();
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  user.otpLastSent = Date.now();
  await user.save();
console.log("Generated OTP:", user.otp);

  res.json({ message: "OTP sent to email" });
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  if (user.otpExpiry < Date.now())
    return res.status(400).json({ message: "OTP expired" });

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({ message: "OTP verified" });
};

/* ================= SET PASSWORD (FINAL SIGNUP STEP) ================= */
export const signupUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.isVerified) {
    return res.status(400).json({ message: "OTP not verified" });
  }

  if (user.password) {
    return res.status(400).json({ message: "Password already set" });
  }

  user.password = await hashPassword(password);
  await user.save();

  res.json({ message: "Signup completed. Please login." });
};

/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user.isVerified) {
    return res.status(401).json({ message: "Please verify OTP first" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.json({ message: "Login successful", token });
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.otp = generateOTP();
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save();

  res.json({ message: "Password reset OTP sent" });
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  user.password = await hashPassword(newPassword);
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
};

/* ================= OTP RATE LIMITER ================= */
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many OTP requests, try later",
});
