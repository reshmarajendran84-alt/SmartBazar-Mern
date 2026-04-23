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

router.get("/invoice/:orderId", protect, async (req, res) => {
  try {
    console.log("Fetching order:", req.params.orderId);
    
    const order = await Order.findById(req.params.orderId)
      .populate('cartItems.productId', 'name images price');
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Debug: Check if cartItems exist
    console.log("Order found:", order._id);
    console.log("Cart items count:", order.cartItems?.length);
    console.log("Cart items:", JSON.stringify(order.cartItems, null, 2));
    
    // Validate cartItems
    if (!order.cartItems || order.cartItems.length === 0) {
      return res.status(400).json({ message: "No items found in this order" });
    }
    
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${order._id.toString().slice(-8)}.pdf`
    );
    
    doc.pipe(res);
    
    // Header
    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();
    
    // Order Info
    doc.fontSize(10);
    doc.text(`Order #: ${order._id.toString().slice(-8).toUpperCase()}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`);
    doc.text(`Payment Method: ${order.paymentMethod || 'N/A'}`);
    doc.text(`Order Status: ${order.status}`);
    doc.moveDown();
    
    // Shipping Address
    if (order.address) {
      doc.fontSize(12).text("Shipping Address:", { underline: true });
      doc.fontSize(10);
      doc.text(order.address.fullName || 'N/A');
      doc.text(order.address.addressLine || 'N/A');
      doc.text(`${order.address.city || 'N/A'}, ${order.address.state || 'N/A'} - ${order.address.pincode || 'N/A'}`);
      doc.text(`Phone: ${order.address.phone || 'N/A'}`);
      doc.moveDown();
    }
    
    // Items Table Header
    const startX = 50;
    let currentY = doc.y;
    
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text("Item", startX, currentY, { width: 200 });
    doc.text("Qty", startX + 250, currentY, { width: 50, align: "right" });
    doc.text("Price", startX + 300, currentY, { width: 60, align: "right" });
    doc.text("Total", startX + 360, currentY, { width: 60, align: "right" });
    
    doc.moveTo(startX, currentY + 5)
      .lineTo(startX + 500, currentY + 5)
      .stroke();
    
    currentY += 15;
    doc.font('Helvetica');
    
    // Table Rows
    order.cartItems.forEach((item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const total = quantity * price;
      
      doc.text((item.name || 'Unknown Product').substring(0, 40), startX, currentY, { width: 200 });
      doc.text(quantity.toString(), startX + 250, currentY, { width: 50, align: "right" });
      doc.text(`₹${price.toFixed(2)}`, startX + 300, currentY, { width: 60, align: "right" });
      doc.text(`₹${total.toFixed(2)}`, startX + 360, currentY, { width: 60, align: "right" });
      
      currentY += 20;
      
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
      }
    });
    
    // Totals
    currentY += 10;
    doc.moveTo(startX, currentY).lineTo(startX + 500, currentY).stroke();
    currentY += 10;
    
    const subtotal = Number(order.subtotal) || 0;
    const shipping = Number(order.shipping) || 0;
    const tax = Number(order.tax) || 0;
    const discount = Number(order.discount) || 0;
    const total = Number(order.total) || 0;
    
    doc.fontSize(10);
    doc.text("Subtotal:", startX + 350, currentY, { width: 70, align: "right" });
    doc.text(`₹${subtotal.toFixed(2)}`, startX + 430, currentY, { width: 70, align: "right" });
    
    currentY += 20;
    doc.text("Shipping:", startX + 350, currentY, { width: 70, align: "right" });
    doc.text(`₹${shipping.toFixed(2)}`, startX + 430, currentY, { width: 70, align: "right" });
    
    currentY += 20;
    doc.text("Tax:", startX + 350, currentY, { width: 70, align: "right" });
    doc.text(`₹${tax.toFixed(2)}`, startX + 430, currentY, { width: 70, align: "right" });
    
    if (discount > 0) {
      currentY += 20;
      doc.text("Discount:", startX + 350, currentY, { width: 70, align: "right" });
      doc.text(`-₹${discount.toFixed(2)}`, startX + 430, currentY, { width: 70, align: "right" });
    }
    
    currentY += 25;
    doc.fontSize(14).font('Helvetica-Bold');
    doc.text("Grand Total:", startX + 330, currentY, { width: 90, align: "right" });
    doc.text(`₹${total.toFixed(2)}`, startX + 430, currentY, { width: 70, align: "right" });
    
    doc.end();
    
  } catch (err) {
    console.error("Invoice generation error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate invoice: " + err.message });
    }
  }
});
router.get("/:orderId",          protect, orderController.getOrderById);

export default router;