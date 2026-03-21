import crypto from "crypto";
import orderService from "../services/orderService.js";

class OrderController {
  async createOnlineOrder(req, res) {
    try {
      const { total } = req.body;

      // 1️⃣ Create Razorpay order
      const razorpayOrder = await orderService.createOrder(total);

      // 2️⃣ Save order in DB
      const order = await orderService.createOnlineOrder(
        req.user.id,
        req.body,
        razorpayOrder.id
      );

      res.json({ razorpayOrder, orderId: order._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Online order failed" });
    }
  }

  async verifyPayment(req, res) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid signature" });
      }

      const updatedOrder = await orderService.markAsPaid(orderId);
      res.json({ success: true, order: updatedOrder });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Payment verification failed" });
    }
  }
}

export default new OrderController();