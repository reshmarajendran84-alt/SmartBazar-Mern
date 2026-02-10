import express from "express";
import AuthController from "../controllers/authController.js";
import { validate } from "../middlewares/authValidationMiddleware.js";
import { otpLimiter } from "../middlewares/rateLimiter.js";
import {
  loginSchema,
  signupSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "../validators/authValidator.js";

const router = express.Router();

router.post("/check-email", validate(signupSchema), AuthController.checkEmail);
router.post("/send-otp", otpLimiter, validate(signupSchema), AuthController.sendSignupOtp);
router.post("/verify-otp", validate(verifyOtpSchema), AuthController.verifyOtp);
router.post("/set-password", validate(loginSchema), AuthController.setPassword);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/forgot-password", otpLimiter, validate(signupSchema), AuthController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), AuthController.resetPassword);

export default router;