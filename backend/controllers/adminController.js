import AdminService from "../services/AdminService.js";
import User from "../models/User.js";

class AdminController {
  async login(req, res) {
    try {
      console.log("LOGIN body:",req.body);
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const token = await AdminService.login(email, password);

      res.json({ token });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }
  async logoutAdmin(req,res){
    try{
      res.clearCookie("adminToken",{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
      });
      res.status(200).json({
        success:false,
        message:"Admin logged out successfully",
      });

    } catch(error){
      res.status(500).json({
        success:false,
        message:"Logout Failed",
      });
    }
  };

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
