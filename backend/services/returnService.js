import Order from "../models/Order.js";
import Product from "../models/Product.js";
import WalletService from "./walletService.js";

class ReturnService {
  async requestReturn(orderId, userId, { reason, description }) {
    console.log("=== ReturnService.requestReturn ===");
    console.log("Order ID:", orderId);
    console.log("User ID:", userId);
    console.log("Reason:", reason);
    
    const order = await Order.findById(orderId);

    if (!order) {
      console.log("Order not found");
      throw new Error("Order not found");
    }
    
    console.log("Found order:", {
      id: order._id,
      status: order.status,
      userId: order.userId.toString(),
      returnRequested: order.returnRequested
    });
    
    // Check authorization
    if (order.userId.toString() !== userId.toString()) {
      console.log("Unauthorized - User ID mismatch");
      throw new Error("Unauthorized");
    }
    
    // Check if order is delivered (case insensitive for safety)
    if (order.status.toLowerCase() !== "delivered") {
      console.log(`Order status is ${order.status}, not Delivered`);
      throw new Error(`Only delivered orders can be returned. Current status: ${order.status}`);
    }
    
    // Check if return already requested
    if (order.returnRequested === true) {
      console.log("Return already requested");
      throw new Error("Return already requested for this order");
    }
    
    // Check if already in return state
    if (order.status === "Return_requested" || order.status === "Returned" || order.status === "Return_rejected") {
      console.log(`Order already in return state: ${order.status}`);
      throw new Error(`Cannot request return. Order is already ${order.status}`);
    }
    
    // Update order for return request
    order.returnRequested = true;
    order.returnReason = reason;
    order.returnDescription = description || "";
    order.returnRequestedAt = new Date();
    order.status = "Return_requested";
    
    await order.save();
    console.log("Return request submitted successfully");
    
    return order;
  }

  async approveReturn(orderId, adminId) {
    try {
      const order = await Order.findById(orderId);

      if (!order) throw new Error("Order not found");
      if (order.status !== "Return_requested") {
        throw new Error("Order is not in return requested state");
      }

      // Update order status
      order.status = "Returned";
      order.returnApprovedAt = new Date();
      order.returnApprovedBy = adminId;
      order.refundStatus = "processing";
      order.refundAmount = order.total;

      await order.save();

      // Process refund to wallet
      try {
        await WalletService.creditWallet(
          order.userId,
          order.total,
          `Refund for returned order #${order._id.toString().slice(-8).toUpperCase()}`,
          order._id,
          "REFUND",
        );

        order.refundStatus = "completed";
        order.refundCompletedAt = new Date();
        await order.save();
      } catch (walletError) {
        console.error("Wallet credit failed:", walletError);
        order.refundStatus = "failed";
        order.refundFailedReason = walletError.message;
        await order.save();
        throw new Error(
          `Refund failed but order is marked as returned. Please process refund manually. Error: ${walletError.message}`,
        );
      }

      // Restore stock
      for (const item of order.cartItems) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }

      return {
        success: true,
        order,
        refundAmount: order.total,
        message: "Return approved and refund processed successfully",
      };
    } catch (error) {
      console.error("Approve return error:", error);
      throw error;
    }
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
    order.returnRejectedBy = adminId;
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
      query = { status: "Return_rejected" };
    } else {
      query = {
        status: {
          $in: ["Return_requested", "Returned", "Return_rejected"]
        }
      };
    }

    const returns = await Order.find(query)
      .populate("userId", "name email phone")
      .select(
        "_id userId address total status returnReason returnDescription returnRequestedAt returnRejectedAt returnRejectionReason refundAmount returnApprovedAt"
      )
      .sort({ returnRequestedAt: -1 });

    return returns;
  }

  async getUserReturns(userId) {
    const returns = await Order.find({
      userId,
      returnRequested: true,
    }).sort({ returnRequestedAt: -1 });

    return returns;
  }
}

export default new ReturnService();