import Order from "../models/Order.js";
import User from "../models/User.js"; 

class AdminOrderService {

  async getAllOrders({ status, search } = {}) {
    const query = {};

    if (status && status !== "All") {
      query.status = { $regex: new RegExp(`^${status}$`, "i") };
    }

    let userIds = [];
    if (search) {
      const matchingUsers = await User.find({
        $or: [
          { name:  { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");
      userIds = matchingUsers.map(u => u._id);
    }

    const orders = await Order.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    if (search) {
      return orders.filter(order => {
        const idMatch   = order._id.toString().toLowerCase().includes(search.toLowerCase());
        const userMatch = userIds.some(id => id.toString() === order.userId?._id?.toString());
        return idMatch || userMatch;
      });
    }

    return orders;
  }

  async getOrderById(id) {
    const order = await Order.findById(id).populate("userId", "name email");
    if (!order) throw new Error("Order not found");
    return order;
  }

  async updateOrderStatus(id, status) {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) throw new Error("Order not found");
    return order;
  }

  async getOrderStats() {
    const [total, pending, confirmed, shipped, delivered, cancelled] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: { $regex: /^pending$/i } }),
      Order.countDocuments({ status: { $regex: /^confirmed$/i } }),
      Order.countDocuments({ status: { $regex: /^shipped$/i } }),
      Order.countDocuments({ status: { $regex: /^delivered$/i } }),
      Order.countDocuments({ status: { $regex: /^cancelled$/i } }),
    ]);

    return { total, pending, confirmed, shipped, delivered, cancelled };
  }
}

export default new AdminOrderService();