// import orderService from "../services/orderService.js";
// import crypto from "crypto";

// class OrderController {
//   // Create order (COD or ONLINE)
//   async createOrder(req, res) {
//   try {
//     const { cartItems, subtotal, shipping, tax, discount, total, address, paymentMethod, coupon } = req.body;

//     // 🔐 Auth check
//     if (!req.user) {
//       console.log("USER:", req.user);
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     // 🧾 Validation
//     if (!paymentMethod) return res.status(400).json({ message: "Payment method required" });
//     if (!cartItems || cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });
//     if (!total || total <= 0) return res.status(400).json({ message: "Total amount missing" });
//     if (!address) return res.status(400).json({ message: "Address required" });

//     let razorpayOrderId = null;

//     if (paymentMethod === "ONLINE") {
//       try {
//         const razorpayOrder = await orderService.createRazorpayOrder(total);
//         razorpayOrderId = razorpayOrder.id;
//         console.log("Razorpay order created:", razorpayOrderId);
//       } catch (err) {
//         console.error("Razorpay creation failed:", err);
//         return res.status(500).json({ message: "Razorpay order creation failed" });
//       }
//     }

//     // Log request before creating order
//     console.log("ORDER DATA:", req.body);

//     // Create the order in DB
//     const order = await orderService.createOrder(
//       req.user.id,
//       req.body,
//       razorpayOrderId
//     );

//     res.status(201).json({ order, razorpayOrderId });

//   } catch (err) {
//     console.error("CREATE ORDER ERROR:", err.message);
//     res.status(500).json({ message: err.message });
//   }
//   }
//   // Verify Razorpay payment
//   async verifyPayment(req, res) {
//     try {
//       const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

//       const body = razorpay_order_id + "|" + razorpay_payment_id;
//       const expectedSignature = crypto
//         .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//         .update(body)
//         .digest("hex");

//       if (expectedSignature !== razorpay_signature) {
//         return res.status(400).json({ message: "Invalid signature" });
//       }

//       const order = await orderService.markAsPaid(orderId, razorpay_payment_id);
//       res.json({ success: true, order });
//     } catch (err) {
//       console.error("VERIFY PAYMENT ERROR:", err);
//       res.status(500).json({ message: "Payment verification failed" });
//     }
//   }

//   // Cancel order
//   async cancelOrder(req, res) {
//     try {
//       const order = await orderService.cancelOrder(req.params.orderId);
//       res.json({ message: "Order cancelled successfully", order });
//     } catch (err) {
//       console.error("CANCEL ORDER ERROR:", err);
//       res.status(500).json({ message: err.message });
//     }
//   }
// }

// export default new OrderController();

import OrderService from "../services/orderService.js";
import Order from "../models/order.js";

class OrderController {

  // 1. COD order
  async placeCODOrder(req, res) {
    try {
      const userId = req.user.id; // ✅ fixed: was res.userId
      console.log("USER ID:", userId);
      console.log("BODY:", JSON.stringify(req.body, null, 2));
      const order = await OrderService.createOrder(userId, req.body, null);
      res.status(201).json({ success: true, order });
    } catch (err) {
      console.error("COD ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }

  // 2. Create Razorpay session
  async createRazorpayOrder(req, res) {
    try {
      const { amount } = req.body;
      const razorpayOrder = await OrderService.createRazorpayOrder(amount);
      res.status(200).json({ success: true, order: razorpayOrder });
    } catch (err) {
      console.error("RAZORPAY ORDER ERROR:", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  // 3. Verify payment
  async verifyPayment(req, res) {
    try {
      const userId = req.user.id;
      const order = await OrderService.verifyAndSaveOrder(userId, req.body);
      res.status(201).json({ success: true, order });
    } catch (err) {
      console.error("VERIFY PAYMENT ERROR:", err.message);
      if (err.message === "INVALID_SIGNATURE") {
        return res.status(400).json({ message: "Payment verification failed. Invalid signature." });
      }
      res.status(500).json({ message: err.message });
    }
  }

  // 4. Cancel order
  async cancelOrder(req, res) {
    try {
      const userId = req.user.id;
      const order = await OrderService.cancelOrder(req.params.orderId, userId);
      res.status(200).json({ success: true, message: "Order cancelled", order });
    } catch (err) {
      console.error("CANCEL ORDER ERROR:", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  // 5. Return order
  async returnOrder(req, res) {
    try {
      const userId = req.user.id;
      const order = await OrderService.returnOrder(req.params.orderId, userId);
      res.status(200).json({ success: true, message: "Order returned, refund credited", order });
    } catch (err) {
      console.error("RETURN ORDER ERROR:", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  // 6. Get all orders for logged-in user
  async getUserOrders(req, res) {
    try {
      const orders = await OrderService.getUserOrders(req.user.id);
      res.status(200).json({ success: true, orders });
    } catch (err) {
      console.error("GET ORDERS ERROR:", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  // 7. Get single order
  async getOrderById(req, res) {
    try {
      const order = await OrderService.getOrderById(req.params.orderId);
      res.status(200).json({ success: true, order });
    } catch (err) {
      console.error("GET ORDER ERROR:", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  // 8. Update order status (admin)
  async updateOrderStatus(req, res) {
    try {
      const { orderId, status } = req.body;
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status },        // ✅ fixed: schema uses "status" not "orderStatus"
        { new: true }
      );
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.status(200).json({ success: true, order });
    } catch (err) {
      console.error("UPDATE STATUS ERROR:", err.message);
      res.status(500).json({ message: err.message });
    }
  }
}

export default new OrderController();