import User from "../models/User.js";

class AdminController {
  async getAllUsers(req, res) {
    try {
      const users = await User.find().select("-password");

      res.status(200).json({
        success: true,
        users,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default new AdminController();
