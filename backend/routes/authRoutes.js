import express from "express";
import {
  checkEmail,
  sendSignupOtp,
  verifyOtp,
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

import {
  protect,
  authorize,
  validate,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/check-email", checkEmail);
router.post("/send-otp", sendSignupOtp);
router.post("/verify-otp", verifyOtp);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/forget-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
