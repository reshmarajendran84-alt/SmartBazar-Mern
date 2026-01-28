import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import hashPassword from "../utils/hashPassword.js";
import generateOTP from "../utils/generateOTP.js";
import sendEmail from "../utils/sendEmail.js";

class AuthService {
  async checkEmail(email) {
    const user = await User.findOne({ email });
    return user && user.isVerified && user.password
      ? { flow: "LOGIN" }
      : { flow: "SIGNUP" };
  }

  async sendSignupOtp(email) {
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      throw new Error("User already registered");
    }

    if (!user) {
      user = await User.create({ email });
    }

    if (user.otpLastSent && Date.now() - user.otpLastSent < 30000) {
      throw new Error("Wait before resending OTP");
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    user.otpLastSent = Date.now();

    await user.save();
    await sendEmail(email, otp);

    return { message: "OTP sent to email" };
  }

  async verifyOtp(email, otp) {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    if (user.otpExpiry < Date.now()) {
      throw new Error("OTP expired");
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();
    return { message: "OTP verified" };
  }

  async setPassword(email, password) {
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      throw new Error("OTP verification required");
    }

    if (user.password) {
      throw new Error("Password already set");
    }

    user.password = await hashPassword(password);
    await user.save();

    return { message: "Signup completed" };
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email });

    if (!user) throw new Error("User not found");
    if (!user.isVerified) throw new Error("Verify OTP first");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { message: "Login successful", token };
  }

  async sendForgotPasswordOtp(email) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    user.otpLastSent = Date.now();

    await user.save();
    await sendEmail(email, otp);

    return { message: "Reset OTP sent" };
  }

  async resetPassword(email, otp, newPassword) {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    if (user.otpExpiry < Date.now()) {
      throw new Error("OTP expired");
    }

    user.password = await hashPassword(newPassword);
    user.otp = null;
    user.otpExpiry = null;

    await user.save();
    return { message: "Password reset successful" };
  }
}

export default new AuthService();
