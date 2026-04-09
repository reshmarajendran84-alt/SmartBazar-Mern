import Review  from "../models/Review.js";
import Product from "../models/product.js";

class AdminReviewService {

  async getAllReviews({ status } = {}) {
    const query = status ? { status } : {};
    return Review.find(query)
      .populate("userId", "name email")
      .populate("productId", "name images")
      .sort({ createdAt: -1 })
      .lean();
  }

  async updateStatus(reviewId, status) {
    const allowed = ["pending", "approved", "rejected"];
    if (!allowed.includes(status)) throw new Error("Invalid status");

    const review = await Review.findByIdAndUpdate(
      reviewId, { status }, { new: true }
    ).populate("userId", "name").populate("productId", "name");

    if (!review) throw new Error("Review not found");

    const approved = await Review.find({ productId: review.productId, status: "approved" });
    const avg = approved.length
      ? approved.reduce((s, r) => s + r.rating, 0) / approved.length
      : 0;
    await Product.findByIdAndUpdate(review.productId, {
      avgRating:    parseFloat(avg.toFixed(1)),
      totalReviews: approved.length,
    });

    return review;
  }

  async deleteReview(reviewId) {
    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) throw new Error("Review not found");
    return { message: "Review deleted successfully" };
  }
}

export default new AdminReviewService();