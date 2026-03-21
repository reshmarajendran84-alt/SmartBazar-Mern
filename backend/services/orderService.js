import razorpay from "../config/razorpay.js";
import Order from "../models/order.js";

class OrderService {
  // Create Razorpay order
  async createOrder(amount) {
    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };
    return await razorpay.orders.create(options);
  }

  // Save order in DB
  async createOnlineOrder(userId, data, razorpayOrderId) {
    const isOnline = data.paymentMethod === "ONLINE";
    return await Order.create({
      userId,
      items: data.cartItems.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: data.subtotal,
      shipping: data.shipping,
      tax: data.tax,
      discount: data.discount,
      coupon: data.coupon || "",
      total: data.total,
      address: data.address,
      paymentMethod: data.paymentMethod,
      paymentStatus: isOnline ?"PENDING" :"PAID",
      razorpayOrderId:isOnline ? razorpayOrderId:null,
    });
  }

  // Mark as paid
  async markAsPaid(orderId) {
    return await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: "PAID" },
      { new: true }
    );
  }
}

export default new OrderService();