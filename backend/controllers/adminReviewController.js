// backend/controllers/adminReviewController.js
import adminReviewService from "../services/adminReviewService.js";

class AdminReviewController {

  async getAllReviews(req, res) {
    try {
      const { status } = req.query; // ?status=pending|approved|rejected
      const reviews = await adminReviewService.getAllReviews({ status });
      res.status(200).json({ success: true, data: reviews });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { reviewId } = req.params;
      const { status }   = req.body;
      const review = await adminReviewService.updateStatus(reviewId, status);
      res.status(200).json({ success: true, data: review });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteReview(req, res) {
    try {
      const { reviewId } = req.params;
      const result = await adminReviewService.deleteReview(reviewId);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new AdminReviewController();