import User from "../models/User.js";
import AdminUserService from "../services/adminUserService.js";

class AdminUserController {

 async getUsers(req, res) {
    try {
      const users = await AdminUserService.getAllUsers();
      res.json({ success: true, count: users.length, users });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await AdminUserService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await AdminUserService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      if (req.admin && user._id.toString() === req.admin._id.toString()) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      await AdminUserService.deleteUser(req.params.id);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}


export default new AdminUserController();