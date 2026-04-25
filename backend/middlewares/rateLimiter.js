import rateLimit from "express-rate-limit";

// General API limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  // max: 100,
    max: process.env.NODE_ENV === "production" ? 100 : 1000, // Higher limit in dev

  message: { success: false, message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth limiter (stricter)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // max: 5,
   max: process.env.NODE_ENV === "production" ? 5 : 50,

  message: { success: false, message: "Too many login attempts, try again after 15 minutes" },
});

// OTP limiter (already exists, but ensure it's used)
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  // max: 3,
  max: process.env.NODE_ENV === "production" ? 3 : 20,

  message: { success: false, message: "Too many OTP requests, try again later" },
});

// Admin API limiter
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // max: 5,
  max: process.env.NODE_ENV === "production" ? 200 : 2000,

  message: { success: false, message: "Too many requests" },
});