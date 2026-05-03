import User from "../models/User.js";

class AdminUserService {
  async getAllUsers() {
    return await User.find({}).select("-password").sort({ createdAt: -1 });
  }

  async getUserById(userId) {
    return await User.findById(userId).select("-password");
  }

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  }
}

export default new AdminUserService();