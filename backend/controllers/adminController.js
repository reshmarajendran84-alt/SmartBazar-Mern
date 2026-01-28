import authService from "../services/authService.js";

class AuthController {
  checkEmail = async (req, res) => {
    try {
      const { email } = req.body;
      res.json(await authService.checkEmail(email));
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  sendSignupOtp = async (req, res) => {
    try {
      const { email } = req.body;
      res.json(await authService.sendSignupOtp(email));
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  verifyOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
      res.json(await authService.verifyOtp(email, otp));
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  setPassword = async (req, res) => {
    try {
      const { email, password } = req.body;
      res.json(await authService.setPassword(email, password));
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      res.json(await authService.loginUser(email, password));
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      res.json(await authService.sendForgotPasswordOtp(email));
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  resetPassword = async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      res.json(await authService.resetPassword(email, otp, newPassword));
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
}

export default new AuthController();
