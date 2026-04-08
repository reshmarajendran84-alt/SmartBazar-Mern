import express from "express";
import ReviewController from "../controllers/reviewController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/:productId", protect, ReviewController.getReviews);

router.post("/", protect, ReviewController.createReview);

router.put("/:reviewId", protect, ReviewController.updateReview);

router.delete("/:reviewId", protect, ReviewController.deleteReview);

export default router;