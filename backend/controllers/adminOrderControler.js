import Order from "../models/Order.js";
import User from "../models/User.js";

class AdminOrderController {

  // GET /api/admin/orders?status=Pending&search=john
  async getAllOrders(req, res) {
    try {
      const { status, search } = req.query;

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

      const result = search
        ? orders.filter(order => {
            const idMatch   = order._id.toString().toLowerCase().includes(search.toLowerCase());
            const userMatch = userIds.some(id => id.toString() === order.userId?._id?.toString());
            return idMatch || userMatch;
          })
        : orders;

      res.json({ orders: result });
    } catch (err) {
      console.error("getAllOrders error:", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  // GET /api/admin/orders/stats
  async getOrderStats(req, res) {
    try {
      const [total, pending, confirmed, shipped, delivered, cancelled] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: { $regex: /^pending$/i } }),
        Order.countDocuments({ status: { $regex: /^confirmed$/i } }),
        Order.countDocuments({ status: { $regex: /^shipped$/i } }),
        Order.countDocuments({ status: { $regex: /^delivered$/i } }),
        Order.countDocuments({ status: { $regex: /^cancelled$/i } }),
      ]);

      res.json({ total, pending, confirmed, shipped, delivered, cancelled });
    } catch (err) {
      console.error("getOrderStats error:", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  // GET /api/admin/orders/:id
  async getOrderById(req, res) {
    try {
      const order = await Order.findById(req.params.id).populate("userId", "name email");
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.status(200).json({ success: true, order });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  // PUT /api/admin/orders/:id/status
  async updateOrderStatus(req, res) {
    try {
      const { id }     = req.params;
      const { status } = req.body;

      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!order) return res.status(404).json({ message: "Order not found" });
      res.status(200).json({ success: true, order });
    } catch (err) {
      console.error("updateOrderStatus error:", err.message);
      res.status(400).json({ message: err.message });
    }
  }

} // ✅ class closes here

export default new AdminOrderController(); 