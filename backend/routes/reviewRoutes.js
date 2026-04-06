import express from "express";
import protect from "../middlewares/authMiddleware.js";
import adminProtect from "../middlewares/adminProtect.js";
import ReviewController from "../controllers/reviewController.js";

const router = express.Router();

// User routes
router.post("/",                          protect, ReviewController.submitReview);
router.get("/product/:productId",                      ReviewController.getProductReviews);
router.get("/my/:productId",              protect, ReviewController.getUserReview);

// Admin routes
router.get("/admin/all",                  adminProtect, ReviewController.getAllReviews);
router.delete("/admin/:reviewId",         adminProtect, ReviewController.deleteReview);

export default router;