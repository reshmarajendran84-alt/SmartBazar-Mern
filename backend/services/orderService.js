import razorpay from "../config/razorpay.js";
import Order from "../models/Order.js";
import crypto from "crypto";
import WalletService from "./walletService.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

class OrderService {
  // ─── Helper: Deduct stock ─────────────────────────────────────────────────
  async deductStockForItems(cartItems) {
    for (const item of cartItems) {
      const productId = item.productId?._id || item.productId;
      const product = await Product.findById(productId);
      if (!product) throw new Error(`Product ${item.name} not found`);
      if (product.stock < item.quantity)
        throw new Error(`${product.name} has insufficient stock. Available: ${product.stock}`);
      await Product.findByIdAndUpdate(productId, { $inc: { stock: -item.quantity } }, { new: true });
    }
  }

  // ─── Helper: Restore stock ────────────────────────────────────────────────
  async restoreStockForItems(cartItems) {
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } },
        { new: true }
      );
    }
  }

  // ─── Create Razorpay order session ───────────────────────────────────────
  async createRazorpayOrder(amount) {
    if (!amount || amount <= 0) throw new Error("Invalid amount");
    return await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });
  }

  // ─── Save order to DB ─────────────────────────────────────────────────────
   async createOrder(userId, data, razorpayOrderId = null) {
    if (!data.cartItems?.length) throw new Error("Cart is empty");
    if (!data.total || data.total <= 0) throw new Error("Invalid total");
    if (!data.address) throw new Error("Address required");

    await this.deductStockForItems(data.cartItems);

    const processedCartItems = await Promise.all(
      data.cartItems.map(async (item) => {
        let imageUrl = item.image;

        if (!imageUrl && item.productId) {
          const product = await Product.findById(
            item.productId?._id || item.productId
          );
          if (product?.images?.length) imageUrl = product.images[0];
        }

        return {
          productId: item.productId?._id || item.productId,
          name: item.name || "Unknown Product",
          quantity: item.quantity || 1,
          price: item.price || 0,
          image: imageUrl || null,
        };
      })
    );

    const order = await Order.create({
      userId,
      cartItems: processedCartItems,
      subtotal: data.subtotal || 0,
      shipping: data.shipping || 0,
      tax: data.tax || 0,
      discount: data.discount || 0,
      coupon: data.coupon || "",
      total: data.total, 
      address: data.address,
      paymentMethod: data.paymentMethod,
      status: "Pending",
      razorpayOrderId,
    });

    await Cart.findOneAndUpdate(
      { userId },
      { items: [], totalAmount: 0 }
    );

    return order;
  }


  // ─── Verify Razorpay signature + save order ───────────────────────────────
  async verifyAndSaveOrder(userId, body) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) throw new Error("INVALID_SIGNATURE");

    const order = await this.createOrder(
      userId,
      { ...orderData, paymentMethod: "ONLINE" },
      razorpay_order_id
    );
    order.status = "Confirmed";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();
    return order;
  }

  // ─── Cancel order ─────────────────────────────────────────────────────────
  async cancelOrder(orderId, userId) {
    const order = await Order.findById(orderId);

    if (!order) throw new Error("Order not found");
    if (order.userId.toString() !== userId.toString())
      throw new Error("Not authorized");
    if (order.status === "Cancelled")
      throw new Error("Already cancelled");
    if (order.isRefunded)
      throw new Error("Already refunded");

    await this.restoreStockForItems(order.cartItems);

    order.status = "Cancelled";

    if (order.paymentMethod !== "COD") {
      await WalletService.creditWallet(
        userId,
        order.total,
        `Refund for cancelled order #${order._id.toString().slice(-6)}`,
        order._id,
        "REFUND"
      );
      order.isRefunded = true;
    }

    await order.save();
    return order;
  }


  // ─── Return order ─────────────────────────────────────────────────────────
  async returnOrder(orderId, userId) {
    const order = await Order.findById(orderId);

    if (!order) throw new Error("Order not found");
    if (order.userId.toString() !== userId.toString())
      throw new Error("Not authorized");
    if (order.status !== "Delivered")
      throw new Error("Only delivered orders can be returned");
    if (order.isRefunded)
      throw new Error("Already refunded");

    await this.restoreStockForItems(order.cartItems);

    order.status = "Returned";

    await WalletService.creditWallet(
      userId,
      order.total,
      `Refund for returned order #${order._id.toString().slice(-6)}`,
      order._id,
      "REFUND"
    );

    order.isRefunded = true;

    await order.save();
    return order;
  }
  // ─── Wallet order ─────────────────────────────────────────────────────────
  async placeWalletOrder(userId, data) {
    const order = await this.createOrder(userId, { ...data, paymentMethod: "WALLET" }, null);
    await WalletService.debitWallet(
      userId,
      data.total,
      `Payment for order #${order._id.toString().slice(-8).toUpperCase()}`,
      order._id
    );
    order.status = "Confirmed";
    await order.save();
    return order;
  }

  // ─── Get all orders for a user ────────────────────────────────────────────
  async getUserOrders(userId) {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("cartItems.productId", "name images price");

    return orders.map((order) => {
      const obj = order.toObject();
      obj.cartItems = obj.cartItems.map((item) => ({
        ...item,
        image: item.image || item.productId?.images?.[0] || null,
        name: item.name || item.productId?.name,
        price: item.price || item.productId?.price,
      }));
      return obj;
    });
  }

  // ─── Get single order ─────────────────────────────────────────────────────
  async getOrderById(orderId, userId) {
    const order = await Order.findById(orderId).populate(
      "cartItems.productId",
      "name images price description"
    );
    if (!order) throw new Error("Order not found");
    if (userId && order.userId.toString() !== userId.toString())
      throw new Error("Not authorized");

    const obj = order.toObject();
    obj.cartItems = obj.cartItems.map((item) => ({
      ...item,
      image: item.image || item.productId?.images?.[0] || null,
      name: item.name || item.productId?.name,
      price: item.price || item.productId?.price,
    }));
    return obj;
  }
}

export default new OrderService();