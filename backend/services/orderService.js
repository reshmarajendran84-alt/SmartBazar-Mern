// 


// services/orderService.js
import razorpay from "../config/razorpay.js";
import Order from "../models/order.js";
import crypto from "crypto";
import WalletService from "./walletService.js"; // ✅ THIS WAS MISSING — caused the 500

class OrderService {

  // ─── Create Razorpay order session ───────────────────────────────────────
  async createRazorpayOrder(amount) {
    if (!amount || amount <= 0) throw new Error("Invalid amount");
    return await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });
  }

  // ─── Save order to DB (COD or after Razorpay) ────────────────────────────
  async createOrder(userId, data, razorpayOrderId = null) {
    if (!data.cartItems || !data.cartItems.length) throw new Error("Cart is empty");
    if (!data.total || data.total <= 0) throw new Error("Invalid total");
    if (!data.address) throw new Error("Address required");

    return await Order.create({
      userId,
      cartItems: data.cartItems.map((item) => ({
        productId: item.productId?._id || item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: data.subtotal,
      shipping: data.shipping,
      tax: data.tax,
      discount: data.discount || 0,
      coupon: data.coupon || "",
      total: data.total,
      address: {
        fullName:    data.address.fullName    || "",
        phone:       data.address.phone       || "",
        addressLine: data.address.addressLine || "",
        city:        data.address.city        || "",
        state:       data.address.state       || "",
        pincode:     data.address.pincode     || "",
      },
      paymentMethod:  data.paymentMethod,
      status:         "Pending",
      razorpayOrderId: razorpayOrderId || null,
    });
  }

  // ─── Verify Razorpay signature + save order ───────────────────────────────
  async verifyAndSaveOrder(userId, body) {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("INVALID_SIGNATURE");
    }

    const order = await this.createOrder(
      userId,
      { ...orderData, paymentMethod: "ONLINE" },
      razorpay_order_id
    );

    order.status = "Paid";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    return order;
  }

  // ─── Cancel order ─────────────────────────────────────────────────────────
  async cancelOrder(orderId, userId) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    // ✅ Only Pending orders can be cancelled (before shipping)
    if (order.status !== "Pending") {
      throw new Error("Only pending orders can be cancelled");
    }

    order.status = "Cancelled";
    await order.save();

    // ✅ Refund to wallet only for ONLINE (prepaid) orders
    // COD — no money was taken, so no refund needed
    if (order.paymentMethod === "ONLINE") {
      await WalletService.creditWallet(
        userId,
        order.total,
        `Refund for cancelled order #${order._id.toString().slice(-8).toUpperCase()}`,
        order._id
      );
    }

    return order;
  }

  // ─── Return order ─────────────────────────────────────────────────────────
  async returnOrder(orderId, userId) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    // ✅ Only Delivered orders can be returned
    if (order.status !== "Delivered") {
      throw new Error("Only delivered orders can be returned");
    }

    // ✅ 7-day return window check
    const deliveredAt = order.updatedAt; // use updatedAt since no separate deliveredAt field
    const daysSince = (Date.now() - new Date(deliveredAt)) / (1000 * 60 * 60 * 24);
    if (daysSince > 7) {
      throw new Error("Return window expired. Returns accepted within 7 days of delivery.");
    }

    order.status = "Cancelled"; // your enum doesn't have "Returned" — use Cancelled
    await order.save();

    // ✅ Refund to wallet for ALL return requests (both COD and ONLINE)
    await WalletService.creditWallet(
      userId,
      order.total,
      `Refund for returned order #${order._id.toString().slice(-8).toUpperCase()}`,
      order._id
    );

    return order;
  }

  // ─── Get all orders for a user ────────────────────────────────────────────
  async getUserOrders(userId) {
    return await Order.find({ userId }).sort({ createdAt: -1 });
  }

  // ─── Get single order ─────────────────────────────────────────────────────
  async getOrderById(orderId) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");
    return order;
  }
}

export default new OrderService();