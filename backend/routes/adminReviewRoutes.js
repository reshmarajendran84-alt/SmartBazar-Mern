import express               from "express";
import AdminReviewController from "../controllers/adminReviewController.js";
import adminProtect          from "../middlewares/adminProtect.js";

const router = express.Router();

router.get("/",                   adminProtect, AdminReviewController.getAllReviews);
router.patch("/:reviewId/status", adminProtect, AdminReviewController.updateStatus);
router.delete("/:reviewId",       adminProtect, AdminReviewController.deleteReview);

export default router;