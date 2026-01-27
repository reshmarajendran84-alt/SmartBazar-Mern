import User from "../models/User.js";
import bcrypt from "bcryptjs";
import hashPassword from "../utils/hashPassword.js";
import generateOTP from "../utils/generateOTP.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

class AuthService {
  async checkEmail(email) {
    const user = await User.findOne({ email });
    return user && user.isVerified && user.password
      ? { flow: "LOGIN" }
      : { flow: "SIGNUP" };
  }

  // SEND SIGNUP OTP
  async sendSignupOtp(email) {
    let user = await User.findOne({ email });
    if (user && user.isVerified) throw new Error("User already verified");
    if (!user) user = await User.create({ email });

    if (user.otpLastSent && Date.now() - user.otpLastSent < 30000)
      throw new Error("Wait before resending OTP");

    const otp = generateOTP(); // 6-digit OTP
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    user.otpLastSent = Date.now();
    await user.save();

    await sendEmail(email, otp); // ✅ Send OTP to email
    return { message: "OTP sent to email" };
  }

  async verifyOtp(email, otp) {
    const user = await User.findOne({ email });
    if (!user || Number(user.otp) !== Number(otp)) throw new Error("Invalid OTP");
    if (user.otpExpiry < Date.now()) throw new Error("OTP expired");

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return { message: "OTP verified successfully" };
  }

  async setPassword(email, password) {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) throw new Error("Verify OTP first");
    if (user.password) throw new Error("Password already set");

    user.password = await hashPassword(password);
    await user.save();

    return { message: "Password set successfully" };
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    if (!user.isVerified) throw new Error("Verify OTP first");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    return { message: "Login successful", token };
  }

  async sendForgotPasswordOtp(email) {
    const user = await User.findOne({ email });
    if (!user || !user.password) throw new Error("User not registered");

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    user.otpLastSent = Date.now();
    await user.save();

    await sendEmail(email, otp); // ✅ Send OTP for reset
    return { message: "Password reset OTP sent" };
  }

  async resetPassword(email, otp, newPassword) {
    const user = await User.findOne({ email });
    if (!user || Number(user.otp) !== Number(otp)) throw new Error("Invalid OTP");
    if (user.otpExpiry < Date.now()) throw new Error("OTP expired");

    user.password = await hashPassword(newPassword);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return { message: "Password reset successful" };
  }
}

export default new AuthService();
