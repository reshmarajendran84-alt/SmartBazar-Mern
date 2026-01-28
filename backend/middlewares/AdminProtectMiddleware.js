import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const adminProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select("-password");

    next();
  } catch {
    res.status(401).json({ message: "Admin unauthorized" });
  }
};
