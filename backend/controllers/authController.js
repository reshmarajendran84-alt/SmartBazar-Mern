import authService from "../services/authService.js";

class AuthController {
  async checkEmail(req, res) {
    try {
      const { email } = req.body;
      const result = await authService.checkEmail(email);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async sendSignupOtp(req, res) {
    try {
      const { email } = req.body;
      const result = await authService.sendSignupOtp(email);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyOtp(email, otp);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async setPassword(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.setPassword(email, password);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginUser(email, password);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await authService.sendForgotPasswordOtp(email);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await authService.resetPassword(email, otp, newPassword);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

export default new AuthController();
