import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js"; 
import Wallet from "../models/wallet.js";
import PDFDocument from "pdfkit";

class AdminOrderController {

  async getAllOrders(req, res) {
    try {
      const { status, search } = req.query;
      const query = {};
      
      if (status && status !== "All") {
        query.status = status;
      }
      
      let orders = await Order.find(query)
        .populate("userId", "name email phone")
        .sort({ createdAt: -1 });
      
      if (search) {
        const searchLower = search.toLowerCase();
        orders = orders.filter(order => {
          const orderIdMatch = order._id.toString().toLowerCase().includes(searchLower);
          const userNameMatch = order.userId?.name?.toLowerCase().includes(searchLower);
          const userEmailMatch = order.userId?.email?.toLowerCase().includes(searchLower);
          const addressNameMatch = order.address?.fullName?.toLowerCase().includes(searchLower);
          const addressEmailMatch = order.address?.email?.toLowerCase().includes(searchLower);
          const phoneMatch = order.address?.phone?.toLowerCase().includes(searchLower);
          
          return orderIdMatch || userNameMatch || userEmailMatch || 
                 addressNameMatch || addressEmailMatch || phoneMatch;
        });
      }
      
      res.json({ orders });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getOrderStats(req, res) {
    try {
      const [total, pending, confirmed, shipped, delivered, cancelled] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: "Pending" }),
        Order.countDocuments({ status: "Confirmed" }),
        Order.countDocuments({ status: "Shipped" }),
        Order.countDocuments({ status: "Delivered" }),
        Order.countDocuments({ status: "Cancelled" }),
      ]);
      res.json({ total, pending, confirmed, shipped, delivered, cancelled });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await Order.findById(req.params.id).populate("userId", "name email");
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.status(200).json({ success: true, order });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      const previousStatus = order.status;

      if (status === "Delivered" && previousStatus !== "Delivered") {
        order.deliveredAt = new Date();
      }
      if (status === "Cancelled" && previousStatus !== "Cancelled") {
        order.cancelledAt = new Date();
      }
      if (status === "Returned" && previousStatus !== "Returned") {
        order.returnedAt = new Date();
      }

      if (status === "Cancelled" && ["Pending", "Confirmed"].includes(previousStatus)) {
        for (const item of order.cartItems) {
          await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: item.quantity } },
            { new: true }
          );
        }
      }

      order.status = status;
      await order.save();

      res.status(200).json({ success: true, order });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  async rejectReturn(req, res) {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "Return_rejected";
    order.returnRejectedAt = new Date();
order.returnRejectionReason = rejectionReason;

    await order.save();

    res.json({ success: true, message: "Return rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

  async approveReturn(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);
      
      if (!order) return res.status(404).json({ message: "Order not found" });
      if (order.status !== "Return_requested") {
        return res.status(400).json({ message: "Order is not in Return_requested state" });
      }
      
      // Restore stock
      for (const item of order.cartItems) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } },
          { new: true }
        );
      }
      
      let refundAmount = order.total;
      
      // Process refund based on payment method
      if (order.paymentMethod === "WALLET") {
        const wallet = await Wallet.findOne({ userId: order.userId });
        if (wallet) {
          await wallet.addMoney(
            refundAmount,
            `Refund for order #${order._id.toString().slice(-8)}`,
            order._id
          );
        }
      } else if (order.paymentMethod === "ONLINE") {
        order.refundStatus = "processing";
      }
      
      order.status = "Returned";
      order.returnApprovedAt = new Date();
      order.refundAmount = refundAmount;
      order.refundCompletedAt = order.paymentMethod === "WALLET" ? new Date() : null;
      
      await order.save();
      
      res.status(200).json({ 
        success: true, 
        message: "Return approved, refund processed",
        order 
      });
    } catch (err) {
      console.error("Approve return error:", err);
      res.status(500).json({ message: err.message });
    }
  }

  async downloadInvoice  (req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("cartItems.productId", "name");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice_${order._id.toString().slice(-8)}.pdf`);
    doc.pipe(res);

    // ── Header ──
    doc.fontSize(20).font("Helvetica-Bold").text("INVOICE", { align: "right" });
    doc.moveDown(0.5);
    doc.fontSize(10).font("Helvetica")
      .text(`Order #: ${order._id.toString().slice(-8).toUpperCase()}`, { align: "right" })
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, { align: "right" })
      .text(`Status: ${order.status}`, { align: "right" });

    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // ── Customer & Shipping ──
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

    // ── Items table header ──
    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("Item",     50,  doc.y, { width: 240 });
    doc.text("Qty",      290, doc.y - doc.currentLineHeight(), { width: 60, align: "center" });
    doc.text("Price",    350, doc.y - doc.currentLineHeight(), { width: 90, align: "right" });
    doc.text("Total",    440, doc.y - doc.currentLineHeight(), { width: 90, align: "right" });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // ── Items ──
    doc.font("Helvetica").fontSize(10);
    for (const item of order.cartItems) {
      const y = doc.y;
      doc.text(item.name,                    50,  y, { width: 240 });
      doc.text(String(item.quantity),        290, y, { width: 60,  align: "center" });
      doc.text(`Rs.${item.price.toFixed(2)}`,350, y, { width: 90,  align: "right" });
      doc.text(`Rs.${(item.price * item.quantity).toFixed(2)}`, 440, y, { width: 90, align: "right" });
      doc.moveDown(0.8);
    }

    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // ── Totals ──
    const totals = [
      ["Subtotal", order.subtotal],
      ["Shipping", order.shipping],
      ["Tax",      order.tax],
      ...(order.discount > 0 ? [["Discount", -order.discount]] : []),
    ];
    doc.font("Helvetica").fontSize(10);
    for (const [label, val] of totals) {
      doc.text(label,            350, doc.y, { width: 90 });
      doc.text(`Rs.${Math.abs(val).toFixed(2)}`, 440, doc.y - doc.currentLineHeight(), { width: 90, align: "right" });
      doc.moveDown(0.6);
    }
    doc.moveDown(0.3);
    doc.moveTo(350, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.3);
    doc.font("Helvetica-Bold").fontSize(11);
    doc.text("Grand Total",   350, doc.y, { width: 90 });
    doc.text(`Rs.${order.total.toFixed(2)}`, 440, doc.y - doc.currentLineHeight(), { width: 90, align: "right" });

    doc.moveDown(2);
    doc.font("Helvetica").fontSize(9).fillColor("gray").text("Thank you for your order.", { align: "center" });

    doc.end();
  } catch (err) {
    console.error("Invoice error:", err);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
}

}

export default new AdminOrderController();