import ReviewService from "../services/reviewService.js";

class ReviewController {

  // POST /api/reviews
  static async submitReview(req, res) {
    try {
      const userId = req.user._id;
      const review = await ReviewService.submitReview(userId, req.body);
      res.status(201).json({ success: true, data: review });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // GET /api/reviews/product/:productId
  static async getProductReviews(req, res) {
    try {
      const data = await ReviewService.getProductReviews(req.params.productId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/reviews/my/:productId
  static async getUserReview(req, res) {
    try {
      const review = await ReviewService.getUserReview(req.user._id, req.params.productId);
      res.status(200).json({ success: true, data: review });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Admin: GET /api/admin/reviews
  static async getAllReviews(req, res) {
    try {
      const reviews = await ReviewService.getAllReviews();
      res.status(200).json({ success: true, data: reviews });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Admin: DELETE /api/admin/reviews/:reviewId
  static async deleteReview(req, res) {
    try {
      await ReviewService.deleteReview(req.params.reviewId);
      res.status(200).json({ success: true, message: "Review deleted." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default ReviewController;