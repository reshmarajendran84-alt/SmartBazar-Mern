import Review from "../models/Review.js";
import Order from "../models/Order.js";

class ReviewService {

  // Check user actually purchased this product
  static async hasPurchased(userId, productId) {
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      status: "Delivered",
    });
    return !!order;
  }

  // Submit a review
  static async submitReview(userId, { productId, orderId, rating, comment }) {
    const purchased = await ReviewService.hasPurchased(userId, productId);
    if (!purchased) {
      throw new Error("You can only review products you have purchased.");
    }

    const existing = await Review.findOne({ userId, productId });
    if (existing) {
      // Update existing review
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return existing;
    }

    const review = await Review.create({ userId, productId, orderId, rating, comment });
    return review;
  }

  // Get all reviews for a product + average rating
  static async getProductReviews(productId) {
    const reviews = await Review.find({ productId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    const average =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
      reviews,
      averageRating: parseFloat(average.toFixed(1)),
      totalReviews: reviews.length,
    };
  }

  // Check if user already reviewed this product
  static async getUserReview(userId, productId) {
    return await Review.findOne({ userId, productId });
  }

  // Admin: get all reviews
  static async getAllReviews() {
    return await Review.find()
      .populate("userId", "name email")
      .populate("productId", "name")
      .sort({ createdAt: -1 });
  }

  // Admin: delete review
  static async deleteReview(reviewId) {
    return await Review.findByIdAndDelete(reviewId);
  }
}

export default ReviewService;