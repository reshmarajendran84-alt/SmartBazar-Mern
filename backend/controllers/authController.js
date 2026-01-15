import authService from "../services/authServices.js"; 
/* ================= CHECK EMAIL & DECIDE FLOW ================= */

export const checkEmail = async (req, res) => {
  try {
    const result = await authService.checkEmail(req.body.email);
    return res.json(result);
  } catch (err) { 
    console.error("checkEmail error:", err);
    return res.status(500).json({ message: err.message });
  }
};

/* ================= SEND OTP FOR SIGNUP ================= */
export const sendSignupOtp = async (req, res) => {
  try {
    res.json(await authService.sendSignupOtp(req.body.email));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    res.json(await authService.verifyOtp(req.body.email, req.body.otp));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ================= SET PASSWORD (FINAL SIGNUP STEP) ================= */
export const signupUser = async (req, res) => {
  try {
    res.json(await authService.signupUser(req.body.email, req.body.password));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  try {
    res.json(await authService.loginUser(req.body.email, req.body.password));
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(
      req.body.email,
      req.body.otp,
      req.body.newPassword
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
