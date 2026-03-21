import express from "express";
import orderController from "../controllers/orderController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, orderController.createOnlineOrder);
router.post("/verify", protect, orderController.verifyPayment);

export default router;