import razorpay from "../config/razorpay.js";
import Order from "../models/order.js";
import Wallet from "../models/wallet.js";
import crypto from "crypto";

class OrderService {

  async createRazorpayOrder(amount) {
    if (!amount || amount <= 0) throw new Error("Invalid amount");
    return await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });
  }

  async createOrder(userId, data, razorpayOrderId = null) {
    if (!data.cartItems || !data.cartItems.length) throw new Error("Cart is empty");
    if (!data.total || data.total <= 0) throw new Error("Invalid total");
    if (!data.address) throw new Error("Address required");

    return await Order.create({
      user: userId,              // ✅ schema uses "user" not "userId"
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
        fullName: data.address.fullName || "",
        phone: data.address.phone || "",
        addressLine: data.address.addressLine,
        city: data.address.city,
        pincode: data.address.pincode,
      },
      paymentMethod: data.paymentMethod,
      status: data.paymentMethod === "ONLINE" ? "Pending" : "Pending", // ✅ schema uses "status" with "Pending/Paid/Failed"
      razorpayOrderId: razorpayOrderId || null,
    });
  }

  async verifyAndSaveOrder(userId, body) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = body;

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

    order.status = "Paid";                          // ✅ "Paid" not "PAID"
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    return order;
  }

  async cancelOrder(orderId) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.status = "Failed";                        // closest to cancelled in your enum
    await order.save();

    if (order.paymentMethod === "ONLINE" && order.status === "Paid") {
      let wallet = await Wallet.findOne({ userId: order.user });
      if (!wallet) {
        wallet = await Wallet.create({ userId: order.user, balance: 0, transactions: [] });
      }
      wallet.balance += order.total;
      wallet.transactions.push({ type: "CREDIT", amount: order.total, orderId: order._id });
      await wallet.save();
    }

    return order;
  }

  async getUserOrders(userId) {
    return await Order.find({ user: userId }).sort({ createdAt: -1 }); // ✅ "user" not "userId"
  }

  async getOrderById(orderId) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");
    return order;
  }
}

export default new OrderService();