import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import OrderController from "../controllers/orderController.js";

const router = express.Router();

// User routes
router.post("/", protect, OrderController.placeCODOrder);
router.post("/create-razorpay-order", protect, OrderController.createRazorpayOrder);
router.post("/verify-payment", protect, OrderController.verifyPayment);
router.post("/wallet-order", protect, OrderController.placeWalletOrder);

router.get("/my-orders", protect, OrderController.getUserOrders);
router.get("/:orderId", protect, OrderController.getOrderById);

router.get("/user/delivered/:productId", protect, OrderController.getDeliveredOrderForProduct);

router.put("/:orderId/cancel", protect, OrderController.cancelOrder);
router.put("/:orderId/return", protect, OrderController.returnOrder);

// Invoice download
router.get("/:orderId/invoice", protect, OrderController.downloadInvoice);

// Admin route (keep this separate or move to admin routes)
router.put("/admin/update-status", protect, OrderController.updateOrderStatus);

export default router;