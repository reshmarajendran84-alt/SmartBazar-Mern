// // routes/orderRoutes.js
// import express from "express";
// import orderController from "../controllers/orderController.js";
// // import protect from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // router.post("/create-order", protect, orderController.createOrder);
// // router.post("/cancel/:orderId", protect, orderController.cancelOrder);
// // router.post("/verify", protect, orderController.verifyPayment);



// export default router;

import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  placeCODOrder,
  createRazorpayOrder,
  verifyPayment,
  cancelOrder,
  getUserOrders,
  getOrderById,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/cod",              protect, placeCODOrder);
router.post("/razorpay-order",   protect, createRazorpayOrder);
router.post("/verify",           protect, verifyPayment);
router.patch("/cancel/:orderId", protect, cancelOrder);
router.get("/my-orders",         protect, getUserOrders);
router.get("/:orderId",          protect, getOrderById);

export default router;