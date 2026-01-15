import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;


  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }


  if (user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }


  if (user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }


  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();


  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );


  return res.status(200).json({
    message: "OTP verified successfully",
    token,
  });
};
