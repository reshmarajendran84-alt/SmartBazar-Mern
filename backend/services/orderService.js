import razorpay from "../config/razorpay.js";
import Order from "../models/order.js";
import crypto from "crypto";
import WalletService from "./walletService.js";
import Cart from "../models/Cart.js";
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
    console.log("=== createOrder called ===");
    console.log("userId:", userId);
    console.log("data.cartItems:", data.cartItems?.length);
    console.log("data.address:", data.address);
    
    if (!data.cartItems || !data.cartItems.length) throw new Error("Cart is empty");
    if (!data.total || data.total <= 0) throw new Error("Invalid total");
    if (!data.address) throw new Error("Address required");

    // Check if address has required fields
    // const requiredAddressFields = ['addressLine', 'city', 'state', 'pincode', 'phone', 'fullName'];
    // for (const field of requiredAddressFields) {
    //   if (!data.address[field]) {
    //     throw new Error(`Address missing required field: ${field}`);
    //   }
    // }
    
    console.log("All validations passed, creating order...");
    
    // Map cart items safely
    const mappedItems = data.cartItems.map((item) => ({
      productId: item.productId?._id || item.productId,
      name: item.name || "Unknown Product",
      quantity: item.quantity || 1,
      price: item.price || 0,
    }));
    
    // Create order data object
    const orderData = {
      userId,
      cartItems: mappedItems,
      subtotal: data.subtotal || 0,
      shipping: data.shipping || 0,
      tax: data.tax || 0,
      discount: data.discount || 0,
      coupon: data.coupon || "",
      total: data.total,
      address: {
  fullName:    data.address.fullName || data.address.name || "",  // ← add fallback
        phone: data.address.phone || "",
        addressLine: data.address.addressLine || "",
        city: data.address.city || "",
        state: data.address.state || "",
        pincode: data.address.pincode || "",
      },
      paymentMethod: data.paymentMethod,
      status: "Pending",
      razorpayOrderId: razorpayOrderId || null,
    };
  //   if (razorpayOrderId) {
  //   orderData.razorpayOrderId = razorpayOrderId;
  // }
  
  console.log("Order data to save:", JSON.stringify(orderData, null, 2));
  
  const order = await Order.create(orderData);
  console.log("Order saved with ID:", order._id);
    await Cart.findOneAndUpdate({ userId }, { items: [], totalAmount: 0 });//clear cart after order

  return order;

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

    order.status = "Confirmed";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    return order;
  }

  // ─── Cancel order ─────────────────────────────────────────────────────────
  async cancelOrder(orderId, userId) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (order.status !== "Pending") {
      throw new Error("Only pending orders can be cancelled");
    }

    order.status = "Cancelled";
    await order.save();

    if (order.paymentMethod === "ONLINE") { //only refund prepaid orders
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

    if (order.status !== "Delivered") {
      throw new Error("Only delivered orders can be returned");
    }

    const deliveredAt = order.updatedAt;
    const daysSince = (Date.now() - new Date(deliveredAt)) / (1000 * 60 * 60 * 24);
    if (daysSince > 7) {
      throw new Error("Return window expired. Returns accepted within 7 days of delivery.");
    }

    order.status = "Returned";
    await order.save();
if(order.paymentMethod === "ONLINE"){


    await WalletService.creditWallet(
      userId,
      order.total,
      `Refund for returned order #${order._id.toString().slice(-8).toUpperCase()}`,
      order._id
    );
  }
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