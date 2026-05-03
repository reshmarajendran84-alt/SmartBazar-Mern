import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AdminService {
  async login(email, password) {

    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error("Invalid credentials");
    }

   
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

   
    if (!process.env.ADMIN_JWT_SECRET) {
      throw new Error("ADMIN_JWT_SECRET not defined");
    }

   
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "1d" }
    );

    return token;
  }
}

export default new AdminService();