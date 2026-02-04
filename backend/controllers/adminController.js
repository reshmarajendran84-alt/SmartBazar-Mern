import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";

class AdminController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.ADMIN_JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getAllUsers(req, res) {
    const users = await User.find().select("-password");
    res.json({ users });
  }

  async deleteUser(req, res) {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  }
}

export default new AdminController();
