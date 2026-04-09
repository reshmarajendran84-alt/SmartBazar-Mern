import express from "express";
import protect from "../middlewares/authMiddleware.js"; 
import orderController from "../controllers/orderController.js";

const router = express.Router();

router.post("/cod",              protect, orderController.placeCODOrder);
router.post("/razorpay-order",   protect, orderController.createRazorpayOrder);
router.post("/verify",           protect, orderController.verifyPayment);

router.post("/wallet",         protect, orderController.placeWalletOrder); 

router.patch("/cancel/:orderId", protect, orderController.cancelOrder);
router.patch("/return/:orderId", protect, orderController.returnOrder);
router.patch("/status",          protect, orderController.updateOrderStatus);

router.get("/my-orders",         protect, orderController.getUserOrders);
router.get("/:orderId",          protect, orderController.getOrderById);



export default router;