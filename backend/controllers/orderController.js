import OrderService from "../services/orderService.js";
import Order from "../models/order.js";

class OrderController {

  // COD Order
  async placeCODOrder(req, res) {
    try {
      const userId = req.user.id;

      if (!req.body.cartItems?.length)
        return res.status(400).json({ message: "Cart is empty" });

      if (!req.body.address)
        return res.status(400).json({ message: "Address required" });

      if (!req.body.total || req.body.total <= 0)
        return res.status(400).json({ message: "Invalid total amount" });

      const order = await OrderService.createOrder(userId, req.body);

      res.status(201).json({ success: true, order });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  //  Razorpay Order
  async createRazorpayOrder(req, res) {
    try {
      const { amount } = req.body;
      const order = await OrderService.createRazorpayOrder(amount);
      res.json({ success: true, order });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  //  Verify Payment
  async verifyPayment(req, res) {
    try {
      const order = await OrderService.verifyAndSaveOrder(
        req.user.id,
        req.body
      );
      res.status(201).json({ success: true, order });
    } catch (err) {
      if (err.message === "INVALID_SIGNATURE") {
        return res.status(400).json({ message: "Invalid signature" });
      }
      res.status(500).json({ message: err.message });
    }
  }

  //  Cancel Order (uses service)
  async cancelOrder(req, res) {
    try {
      const order = await OrderService.cancelOrder(
        req.params.orderId,
        req.user.id
      );
      res.json({ success: true, order });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  //  Return Order
  async returnOrder(req, res) {
    try {
      const order = await OrderService.returnOrder(
        req.params.orderId,
        req.user.id
      );
      res.json({ success: true, order });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  //  Get All Orders
  async getUserOrders(req, res) {
    try {
      const orders = await OrderService.getUserOrders(req.user.id);
      res.json({ success: true, orders });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get Single Order
  async getOrderById(req, res) {
    try {
      const order = await OrderService.getOrderById(
        req.params.orderId,
        req.user.id
      );
      res.json({ success: true, order });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  //  Admin Update
  async updateOrderStatus(req, res) {
    try {
      const { orderId, status } = req.body;

      const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!order)
        return res.status(404).json({ message: "Order not found" });

      res.json({ success: true, order });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  //  Wallet Order
  async placeWalletOrder(req, res) {
    try {
      const userId = req.user.id;

      if (!req.body.cartItems?.length)
        return res.status(400).json({ message: "Cart is empty" });

      if (!req.body.address)
        return res.status(400).json({ message: "Address required" });

      if (!req.body.total || req.body.total <= 0)
        return res.status(400).json({ message: "Invalid total" });

      const order = await OrderService.placeWalletOrder(userId, req.body);

      res.status(201).json({ success: true, order });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

export default new OrderController();