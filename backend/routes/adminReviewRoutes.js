import express from "express";
import AdminReviewController from "../controllers/adminReviewController.js";
import protect from "../middlewares/authMiddleware.js";
import adminProtect from "../middlewares/adminProtect.js";

const router = express.Router();

router.get("/all", protect, adminProtect, AdminReviewController.getAllReview);
router.delete("/:reviewId", protect, adminProtect, AdminReviewController.deleteReview);

export default router;