import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js"; 
import Wallet from "../models/wallet.js";

class AdminOrderController {

  async getAllOrders(req, res) {
    try {
      const { status, search } = req.query;
      const query = {};
      
      if (status && status !== "All") {
        query.status = status;
      }
      
      let orders = await Order.find(query)
        .populate("userId", "name email phone")
        .sort({ createdAt: -1 });
      
      if (search) {
        const searchLower = search.toLowerCase();
        orders = orders.filter(order => {
          const orderIdMatch = order._id.toString().toLowerCase().includes(searchLower);
          const userNameMatch = order.userId?.name?.toLowerCase().includes(searchLower);
          const userEmailMatch = order.userId?.email?.toLowerCase().includes(searchLower);
          const addressNameMatch = order.address?.fullName?.toLowerCase().includes(searchLower);
          const addressEmailMatch = order.address?.email?.toLowerCase().includes(searchLower);
          const phoneMatch = order.address?.phone?.toLowerCase().includes(searchLower);
          
          return orderIdMatch || userNameMatch || userEmailMatch || 
                 addressNameMatch || addressEmailMatch || phoneMatch;
        });
      }
      
      res.json({ orders });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getOrderStats(req, res) {
    try {
      const [total, pending, confirmed, shipped, delivered, cancelled] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: "Pending" }),
        Order.countDocuments({ status: "Confirmed" }),
        Order.countDocuments({ status: "Shipped" }),
        Order.countDocuments({ status: "Delivered" }),
        Order.countDocuments({ status: "Cancelled" }),
      ]);
      res.json({ total, pending, confirmed, shipped, delivered, cancelled });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await Order.findById(req.params.id).populate("userId", "name email");
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.status(200).json({ success: true, order });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      const previousStatus = order.status;

      if (status === "Delivered" && previousStatus !== "Delivered") {
        order.deliveredAt = new Date();
      }
      if (status === "Cancelled" && previousStatus !== "Cancelled") {
        order.cancelledAt = new Date();
      }
      if (status === "Returned" && previousStatus !== "Returned") {
        order.returnedAt = new Date();
      }

      if (status === "Cancelled" && ["Pending", "Confirmed"].includes(previousStatus)) {
        for (const item of order.cartItems) {
          await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: item.quantity } },
            { new: true }
          );
        }
      }

      order.status = status;
      await order.save();

      res.status(200).json({ success: true, order });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  async rejectReturn(req, res) {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "Return_rejected";
    order.returnRejectedAt = new Date();
order.returnRejectionReason = rejectionReason;

    await order.save();

    res.json({ success: true, message: "Return rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

  async approveReturn(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);
      
      if (!order) return res.status(404).json({ message: "Order not found" });
      if (order.status !== "Return_requested") {
        return res.status(400).json({ message: "Order is not in Return_requested state" });
      }
      
      // Restore stock
      for (const item of order.cartItems) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } },
          { new: true }
        );
      }
      
      let refundAmount = order.total;
      
      // Process refund based on payment method
      if (order.paymentMethod === "WALLET") {
        const wallet = await Wallet.findOne({ userId: order.userId });
        if (wallet) {
          await wallet.addMoney(
            refundAmount,
            `Refund for order #${order._id.toString().slice(-8)}`,
            order._id
          );
        }
      } else if (order.paymentMethod === "ONLINE") {
        order.refundStatus = "processing";
      }
      
      order.status = "Returned";
      order.returnApprovedAt = new Date();
      order.refundAmount = refundAmount;
      order.refundCompletedAt = order.paymentMethod === "WALLET" ? new Date() : null;
      
      await order.save();
      
      res.status(200).json({ 
        success: true, 
        message: "Return approved, refund processed",
        order 
      });
    } catch (err) {
      console.error("Approve return error:", err);
      res.status(500).json({ message: err.message });
    }
  }
}

export default new AdminOrderController();