
import OrderService from "../services/orderService.js";
import Order from "../models/order.js";

class OrderController {

 
  async placeCODOrder(req, res) {
  try {
    console.log("=== COD ORDER REQUEST ===");
    console.log("User ID:", req.user?.id);
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    
    const userId = req.user.id;
    
    // Validate required fields
    if (!req.body.cartItems || req.body.cartItems.length === 0) {
      console.log("ERROR: No cart items");
      return res.status(400).json({ message: "Cart is empty" });
    }
    
    if (!req.body.address) {
      console.log("ERROR: No address");
      return res.status(400).json({ message: "Address required" });
    }
    
    if (!req.body.total || req.body.total <= 0) {
      console.log("ERROR: Invalid total");
      return res.status(400).json({ message: "Invalid total amount" });
    }
    
    console.log("Calling OrderService.createOrder...");
    const order = await OrderService.createOrder(userId, req.body, null);
    console.log("Order created successfully:", order._id);
    
    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("COD ERROR DETAILS:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ message: err.message, stack: err.stack });
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
        { status },        
        { new: true }
      );
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.status(200).json({ success: true, order });
    } catch (err) {
      console.error("UPDATE STATUS ERROR:", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  //wallet 
  async placeWalletOrder(req, res) {
  try {
    const userId = req.user.id;

    if (!req.body.cartItems?.length)
      return res.status(400).json({ message: "Cart is empty" });
    if (!req.body.address)
      return res.status(400).json({ message: "Address required" });
    if (!req.body.total || req.body.total <= 0)
      return res.status(400).json({ message: "Invalid total" });

    //  Debit wallet first — throws if insufficient balance
    const order = await OrderService.placeWalletOrder(userId, req.body);
    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("WALLET ORDER ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
}
async getOrderById(req, res) {
  try {
    const order = await OrderService.getOrderById(req.params.orderId, req.user.id);
    res.status(200).json({ success: true, order });
  } catch (err) {
    const status = err.message === "Not authorized" ? 403 : 500;
    res.status(status).json({ message: err.message });
  }
}
}

export default new OrderController();