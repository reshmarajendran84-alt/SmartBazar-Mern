import User from "../models/User.js";

class AdminUserController {

  async getUsers(req, res) {
    try {
      const users = await User.find({}).select("-password").sort({ createdAt: -1 });
      console.log(`Found ${users.length} users`); // Debug log
      res.json({ 
        success: true, 
        count: users.length,
        users: users 
      });
    } catch (error) {
      console.error("Error in getUsers:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server error fetching users" 
      });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }
      res.json({ 
        success: true, 
        user: user 
      });
    } catch (error) {
      console.error("Error in getUserById:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server error fetching user" 
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }
      
      // Prevent admin from deleting themselves
      if (req.user && user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ 
          success: false, 
          message: "Cannot delete your own account" 
        });
      }
      
      await User.findByIdAndDelete(req.params.id);
      res.json({ 
        success: true, 
        message: "User deleted successfully" 
      });
    } catch (error) {
      console.error("Error in deleteUser:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server error deleting user" 
      });
    }
  }
}

export default new AdminUserController();