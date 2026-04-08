import adminReviewService from "../services/adminReviewService.js"; // <-- include .js extension!

class AdminReviewController {
  async getAllReview(req, res) {
    try {
      const review = await adminReviewService.getAllReview();
      res.status(200).json({
        success: true,
        data: review,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteReview(req, res) {
    try {
      const { reviewId } = req.params;
      const result = await adminReviewService.deleteReview(reviewId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AdminReviewController();