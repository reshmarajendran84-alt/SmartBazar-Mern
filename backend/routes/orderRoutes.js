// // routes/orderRoutes.js
// import express from "express";
// import orderController from "../controllers/orderController.js";
// // import protect from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // router.post("/create-order", protect, orderController.createOrder);
// // router.post("/cancel/:orderId", protect, orderController.cancelOrder);
// // router.post("/verify", protect, orderController.verifyPayment);



// export default router;

// routes/orderRoutes.js

// routes/orderRoutes.js
import express from "express";
import protect from "../middlewares/authMiddleware.js"; // only one import
import orderController from "../controllers/orderController.js";

const router = express.Router();

router.post("/cod",              protect, orderController.placeCODOrder);
router.post("/razorpay-order",   protect, orderController.createRazorpayOrder);
router.post("/verify",           protect, orderController.verifyPayment);
router.patch("/cancel/:orderId", protect, orderController.cancelOrder);
router.patch("/return/:orderId", protect, orderController.returnOrder);
router.get("/my-orders",         protect, orderController.getUserOrders);
router.get("/:orderId",          protect, orderController.getOrderById);
router.patch("/status",          protect, orderController.updateOrderStatus);

export default router;