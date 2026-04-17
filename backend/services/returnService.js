// backend/services/returnService.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Wallet from "../models/Wallet.js";

class ReturnService {
  
  // User requests return
  async requestReturn(orderId, userId, { reason, description }) {
    const order = await Order.findById(orderId);
    
    if (!order) throw new Error("Order not found");
    if (order.userId.toString() !== userId.toString()) {
      throw new Error("Unauthorized");
    }
    if (order.status !== "Delivered") {
      throw new Error("Only delivered orders can be returned");
    }
    if (order.returnRequested) {
      throw new Error("Return already requested for this order");
    }
    
    // Check return deadline (7 days after delivery)
    const daysSinceDelivery = Math.floor((Date.now() - new Date(order.deliveredAt)) / (1000 * 60 * 60 * 24));
    if (daysSinceDelivery > 7) {
      throw new Error("Return period expired (7 days)");
    }
    
    // Update order with return request
    order.returnRequested = true;
    order.returnReason = reason;
    order.returnDescription = description;
    order.returnRequestedAt = new Date();
    order.status = "Return_requested";
    
    await order.save();
    console.log(`Return request created for order ${orderId}`);
    
    return order;
  }
  
  // Admin approves return
  async approveReturn(orderId, adminId) {
    const order = await Order.findById(orderId);
    
    if (!order) throw new Error("Order not found");
    if (order.status !== "Return_requested") {
      throw new Error("Order is not in return requested state");
    }
    
    // Restore stock
    for (const item of order.cartItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } },
        { new: true }
      );
    }
    
    // Calculate refund amount
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
    }
    
    order.status = "Returned";
    order.returnApprovedAt = new Date();
    order.refundAmount = refundAmount;
    order.refundCompletedAt = order.paymentMethod === "WALLET" ? new Date() : null;
    
    await order.save();
    console.log(`Return approved for order ${orderId}, refund amount: ${refundAmount}`);
    
    return { order, refundAmount };
  }
  
  // Admin rejects return
  async rejectReturn(orderId, adminId, rejectionReason) {
     console.log("=== RETURN SERVICE DEBUG ===");
  console.log("Order ID:", orderId);
  console.log("Rejection reason:", rejectionReason);
    const order = await Order.findById(orderId);
    
    if (!order) throw new Error("Order not found");
    if (order.status !== "Return_requested") {
      throw new Error("Order is not in return requested state");
    }
    
    order.status = "Delivered";
    order.returnRequested = false;
    order.returnRejectedAt = new Date();
    order.returnRejectionReason = rejectionReason;
    
    await order.save();
  console.log("Saved order - returnRejectionReason:", order.returnRejectionReason);
      console.log("============================");

    return order;
  }
  
  // Get all return requests (admin)
  async getReturnRequests(status = "all") {
    let query = {};
    
    if (status === "pending") {
      query = { status: "Return_requested" };
    } else if (status === "approved") {
      query = { status: "Returned" };
    } else if (status === "rejected") {
      query = { returnRejectedAt: { $ne: null } };
    } else {
      // For "all", get all orders with return requests
      query = { returnRequested: true };
    }
    
    console.log("Querying returns with filter:", query);
    
    const returns = await Order.find(query)
      .populate("userId", "name email phone")
      .sort({ returnRequestedAt: -1 });
    
    console.log(`Found ${returns.length} return requests`);
    return returns;
  }
  
  // Get user's return requests
  async getUserReturns(userId) {
    const returns = await Order.find({
      userId,
      returnRequested: true
    }).sort({ returnRequestedAt: -1 });
    
    return returns;
  }
}

export default new ReturnService();