import Review from "../models/Review.js";

class AdminReviewService {
  async getAllReview() {
    return Review.find().populate("userId productId").lean();
  }

  async deleteReview(reviewId) {
    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) throw new Error("Review not found");
    return { message: "Review deleted successfully" };
  }
}

export default new AdminReviewService();