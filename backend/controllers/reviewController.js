import ReviewService from "../services/reviewService.js";
class ReviewController {

  // ── GET /review/:productId ─────────────────────────────────────────────
  async getReviews(req, res) {
    try {
      const { productId } = req.params;
      const currentUserId = req.user?._id ?? null;

      const result = await ReviewService.getReviewsByProduct(
        productId,
        currentUserId
      );

      res.status(200).json(result);
    } catch (err) {
      console.error("ReviewController.getReviews:", err.message);
      res.status(err.statusCode || 500).json({ message: err.message || "Server error" });
    }
  }

  // ── POST /review ───────────────────────────────────────────────────────
  async createReview(req, res) {
    try {
      const { productId, orderId, rating, comment } = req.body;
      const userId = req.user._id;

      const review = await ReviewService.createReview({
        productId,
        orderId,
        rating,
        comment,
        userId,
      });

      res.status(201).json({ message: "Review submitted successfully", review });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ message: "You already reviewed this product" });
      }
      console.error("ReviewController.createReview:", err.message);
      res.status(err.statusCode || 500).json({ message: err.message || "Server error" });
    }
  }

  // ── PUT /review/:reviewId ──────────────────────────────────────────────
  async updateReview(req, res) {
    try {
      const { reviewId }        = req.params;
      const { rating, comment } = req.body;
      const userId              = req.user._id;

      const review = await ReviewService.updateReview({ reviewId, rating, comment, userId });

      res.status(200).json({ message: "Review updated successfully", review });
    } catch (err) {
      console.error("ReviewController.updateReview:", err.message);
      res.status(err.statusCode || 500).json({ message: err.message || "Server error" });
    }
  }

  // ── DELETE /review/:reviewId ───────────────────────────────────────────
  async deleteReview(req, res) {
    try {
      const { reviewId } = req.params;
      const userId       = req.user._id;

      await ReviewService.deleteReview({ reviewId, userId });

      res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
      console.error("ReviewController.deleteReview:", err.message);
      res.status(err.statusCode || 500).json({ message: err.message || "Server error" });
    }
  }
}

export default new ReviewController();
