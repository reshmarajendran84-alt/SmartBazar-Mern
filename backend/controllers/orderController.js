import OrderService from "../services/orderService.js";
import Order from "../models/Order.js";
import PDFDocument from "pdfkit";

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
  

 async downloadInvoice(req, res) {
  try {
    // Use whichever param your route defines: orderId or id
    const id = req.params.orderId || req.params.id;
 
    const order = await Order.findById(id)
      .populate("userId", "name email")
      .populate("cartItems.productId", "name");
 
    if (!order) return res.status(404).json({ message: "Order not found" });
 
    const doc = new PDFDocument({ margin: 50 });
 
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${order._id.toString().slice(-8)}.pdf`
    );
    doc.pipe(res);
 
    // Header
    doc.fontSize(20).font("Helvetica-Bold").text("INVOICE", { align: "right" });
    doc.moveDown(0.5);
    doc.fontSize(10).font("Helvetica")
      .text(`Order #: ${order._id.toString().slice(-8).toUpperCase()}`, { align: "right" })
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, { align: "right" })
      .text(`Status: ${order.status}`, { align: "right" });
 
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);
 
    // Bill To
    doc.font("Helvetica-Bold").fontSize(11).text("Bill To:");
    doc.font("Helvetica").fontSize(10)
      .text(order.address?.fullName || order.userId?.name || "N/A")
      .text(order.address?.addressLine || "")
      .text(`${order.address?.city}, ${order.address?.state} - ${order.address?.pincode}`)
      .text(`Phone: ${order.address?.phone}`)
      .text(`Email: ${order.userId?.email || "N/A"}`);
 
    doc.moveDown(1);
    doc.text(`Payment Method: ${order.paymentMethod}`);
    if (order.razorpayPaymentId) doc.text(`Payment ID: ${order.razorpayPaymentId}`);
 
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
 
    // Table header
    doc.font("Helvetica-Bold").fontSize(10);
    const headerY = doc.y;
    doc.text("Item",  50,  headerY, { width: 240 });
    doc.text("Qty",   290, headerY, { width: 60,  align: "center" });
    doc.text("Price", 350, headerY, { width: 90,  align: "right" });
    doc.text("Total", 440, headerY, { width: 90,  align: "right" });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
 
    // Items
    doc.font("Helvetica").fontSize(10);
    for (const item of order.cartItems) {
      const y = doc.y;
      doc.text(item.name,                              50,  y, { width: 240 });
      doc.text(String(item.quantity),                  290, y, { width: 60,  align: "center" });
      doc.text(`Rs.${item.price.toFixed(2)}`,          350, y, { width: 90,  align: "right" });
      doc.text(`Rs.${(item.price * item.quantity).toFixed(2)}`, 440, y, { width: 90, align: "right" });
      doc.moveDown(0.8);
    }
 
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
 
    // Totals
    const totals = [
      ["Subtotal", order.subtotal],
      ["Shipping", order.shipping],
      ["Tax",      order.tax],
      ...(order.discount > 0 ? [["Discount", -order.discount]] : []),
    ];
    doc.font("Helvetica").fontSize(10);
    for (const [label, val] of totals) {
      const ty = doc.y;
      doc.text(label, 350, ty, { width: 90 });
      doc.text(`Rs.${Math.abs(val).toFixed(2)}`, 440, ty, { width: 90, align: "right" });
      doc.moveDown(0.6);
    }
    doc.moveDown(0.3);
    doc.moveTo(350, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.3);
 
    doc.font("Helvetica-Bold").fontSize(11);
    const gtY = doc.y;
    doc.text("Grand Total", 350, gtY, { width: 90 });
    doc.text(`Rs.${order.total.toFixed(2)}`, 440, gtY, { width: 90, align: "right" });
 
    doc.moveDown(2);
    doc.font("Helvetica").fontSize(9).fillColor("gray")
      .text("Thank you for your order.", { align: "center" });
 
    doc.end();
  } catch (err) {
    console.error("Invoice error:", err);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
}
}

export default new OrderController();