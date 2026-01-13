import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  // 1️⃣ Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 2️⃣ Check OTP
  if (user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // 3️⃣ Check expiry
  if (user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  // 4️⃣ Mark verified
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  // 5️⃣ Generate JWT
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // 6️⃣ Send response
  return res.status(200).json({
    message: "OTP verified successfully",
    token,
  });
};
