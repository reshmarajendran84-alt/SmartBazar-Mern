import express from "express";
import AuthController from "../controllers/authController.js";
import { validate } from "../middlewares/authValidationMiddleware.js";
import { otpLimiter } from "../middlewares/rateLimiter.js";
import {
  registerValidationRules,
  loginValidationRules,
  otpValidationRules,
  verifyOtpValidationRules,
  resetPasswordValidationRules,
} from "../middlewares/authValidationMiddleware.js";

const router = express.Router();

router.post("/check-email", otpValidationRules, validate, AuthController.checkEmail);

router.post("/send-otp", otpLimiter, otpValidationRules, validate, AuthController.sendSignupOtp);

router.post("/verify-otp", verifyOtpValidationRules, validate, AuthController.verifyOtp);

router.post("/set-password", registerValidationRules, validate, AuthController.setPassword);

router.post("/login", loginValidationRules, validate, AuthController.login);

router.post("/forgot-password", otpLimiter, otpValidationRules, validate, AuthController.forgotPassword);

router.post("/reset-password", resetPasswordValidationRules, validate, AuthController.resetPassword);

export default router;