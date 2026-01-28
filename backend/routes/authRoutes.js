import express from "express";
import AuthController from "../controllers/authController.js";

const router = express.Router();

router.post("/check-email", AuthController.checkEmail);
router.post("/send-otp", AuthController.sendSignupOtp);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/set-password", AuthController.setPassword);
router.post("/login", AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

export default router;