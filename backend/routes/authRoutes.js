import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/check-email", authController.checkEmail);
router.post("/send-otp", authController.sendSignupOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/set-password", authController.setPassword);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;
