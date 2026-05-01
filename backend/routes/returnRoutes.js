import express from "express";
import ReturnController from "../controllers/returnController.js";
import adminProtect from "../middlewares/adminProtect.js";
import { protect } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

// User routes
router.post("/request/:orderId", protect, ReturnController.requestReturn);
router.get("/my-returns", protect, ReturnController.getUserReturns);

// Admin routes
router.get("/", adminProtect, ReturnController.getReturnRequests);
router.post("/approve/:orderId", adminProtect, ReturnController.approveReturn);
router.post("/:orderId/reject", adminProtect, ReturnController.rejectReturn);

export default router;