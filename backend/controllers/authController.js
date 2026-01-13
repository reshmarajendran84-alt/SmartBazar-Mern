import User from "../models/User.js";
import hashPassword from "../utils/hashPassword.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateOTP from "../utils/generateOTP.js";

/* ================= CHECK EMAIL & DECIDE FLOW ================= */
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      // Existing user → go to password entry
      return res.json({ flow: "LOGIN" });
    } else {
      // New user → go to OTP verification
      return res.json({ flow: "SIGNUP" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= SIGNUP (SET PASSWORD AFTER OTP) ================= */
export const signupUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user as verified (OTP should have been verified before this step)
    const user = await User.create({
      email,
      password: hashedPassword,
      isVerified: true, // after OTP verification
    });

    return res.status(201).json({
      message: "Signup successful! Please login.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify OTP first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
