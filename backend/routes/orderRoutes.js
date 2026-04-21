import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import orderController from "../controllers/orderController.js";
import { validateStock } from "../middlewares/validateStock.js";
import Order from "../models/order.js";        // ← add this import
import PDFDocument from "pdfkit";              // ← add this import (npm install pdfkit)

const router = express.Router();

router.post("/cod",              protect, validateStock, orderController.placeCODOrder);
router.post("/razorpay-order",   protect, orderController.createRazorpayOrder);
router.post("/verify",           protect, orderController.verifyPayment);
router.post("/wallet",           protect, validateStock, orderController.placeWalletOrder);

router.patch("/cancel/:orderId", protect, orderController.cancelOrder);
router.patch("/return/:orderId", protect, orderController.returnOrder);
router.patch("/status",          protect, orderController.updateOrderStatus);

router.get("/my-orders",         protect, orderController.getUserOrders);

// ↓ ADD THIS BLOCK HERE — must be before /:orderId
router.get("/invoice/:orderId", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice_${order._id.toString().slice(-8)}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text(`Order #: ${order._id.toString().slice(-8).toUpperCase()}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`);
    doc.text(`Payment: ${order.paymentMethod}`);
    doc.moveDown();

    doc.fontSize(12).text("Delivery Address:", { underline: true });
    doc.fontSize(10).text(`${order.address.fullName}`);
    doc.text(`${order.address.addressLine}`);
    doc.text(`${order.address.city}, ${order.address.state} - ${order.address.pincode}`);
    doc.text(`Phone: ${order.address.phone}`);
    doc.moveDown();

    doc.fontSize(12).text("Items:", { underline: true });
    doc.moveDown(0.5);
    order.cartItems.forEach((item, i) => {
      doc.fontSize(10).text(
        `${i + 1}. ${item.name}   Qty: ${item.quantity}   Price: ₹${item.price}   Total: ₹${item.price * item.quantity}`
      );
    });
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    if (order.subtotal) doc.text(`Subtotal: ₹${order.subtotal}`);
    if (order.shipping) doc.text(`Shipping: ₹${order.shipping}`);
    if (order.tax)      doc.text(`Tax: ₹${order.tax}`);
    if (order.discount) doc.text(`Discount: -₹${order.discount}`);
    doc.fontSize(13).text(`Grand Total: ₹${order.total}`, { bold: true });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ↑ END OF INVOICE BLOCK

// This must always be LAST among GET routes — wildcard catches everything
router.get("/:orderId",          protect, orderController.getOrderById);

export default router;