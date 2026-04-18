import Order from "../models/Order.js";
import Product from "../models/Product.js";
import WalletService from "./walletService.js";

class ReturnService {

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

    const daysSinceDelivery = Math.floor(
      (Date.now() - new Date(order.deliveredAt)) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceDelivery > 7) {
      throw new Error("Return period expired (7 days)");
    }

    order.returnRequested = true;
    order.returnReason = reason;
    order.returnDescription = description;
    order.returnRequestedAt = new Date();
    order.status = "Return_requested";

    await order.save();
    return order;
  }

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

    const refundAmount = order.total;

    await WalletService.creditWallet(
      order.userId,
      refundAmount,
      `Refund for returned order #${order._id.toString().slice(-8).toUpperCase()}`,
      order._id
    );

    order.status = "Returned";
    order.returnApprovedAt = new Date();
    order.refundAmount = refundAmount;
    order.refundCompletedAt = new Date();

    await order.save();
    return { order, refundAmount };
  }

  async rejectReturn(orderId, adminId, rejectionReason) {
    const order = await Order.findById(orderId);

    if (!order) throw new Error("Order not found");
    if (order.status !== "Return_requested") {
      throw new Error("Order is not in return requested state");
    }

    order.status = "Return_rejected";
    order.returnRequested = false;
    order.returnRejectedAt = new Date();
    order.returnRejectionReason = rejectionReason;

    await order.save();
    return order;
  }

  async getReturnRequests(status = "all") {
    let query = {};

    if (status === "pending") {
      query = { status: "Return_requested" };
    } else if (status === "approved") {
      query = { status: "Returned" };
    } else if (status === "rejected") {
      query = {
        $or: [
          { status: "Return_rejected" },
          { returnRejectedAt: { $ne: null } }
        ]
      };
    } else {
      query = { returnRequested: true };
    }

    const returns = await Order.find(query)
      .populate("userId", "name email phone")
      .select("_id userId address total status returnReason returnDescription returnRequestedAt returnRejectedAt returnRejectionReason refundAmount")
      .sort({ returnRequestedAt: -1 });

    return returns;
  }

  async getUserReturns(userId) {
    const returns = await Order.find({
      userId,
      returnRequested: true
    }).sort({ returnRequestedAt: -1 });

    return returns;
  }
}

export default new ReturnService();