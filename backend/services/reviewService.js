import Review from "../models/Review.js";
import Order from "../models/order.js";
import Product from "../models/product.js";

class ReviewService {

  // ── Get all reviews for a product ─────────────────────────────────────
  async getReviewsByProduct(productId, currentUserId = null) {
    const reviews = await Review.find({ productId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const shaped = reviews.map((r) => ({
      _id:       r._id,
      rating:    r.rating,
      comment:   r.comment,
      createdAt: r.createdAt,
      isOwner:   currentUserId
                   ? r.userId._id.toString() === currentUserId.toString()
                   : false,
      user: {
        name: r.userId.name,
      },
    }));

    return {
      reviews:   shaped,
      avgRating: parseFloat(avgRating.toFixed(1)),
    };
  }

  // ── Create a new review ────────────────────────────────────────────────
  async createReview({ productId, orderId, rating, comment, userId }) {
    // 1. Validate rating range
    if (!rating || rating < 1 || rating > 5) {
      const err = new Error("Rating must be between 1 and 5");
      err.statusCode = 400;
      throw err;
    }

    // 2. Validate comment
    if (!comment?.trim()) {
      const err = new Error("Comment is required");
      err.statusCode = 400;
      throw err;
    }

    // 3. Verify the order
    const order = await Order.findById(orderId);
    if (!order) {
      const err = new Error("Order not found");
      err.statusCode = 404;
      throw err;
    }

    if (order.userId.toString() !== userId.toString()) {
      const err = new Error("This order does not belong to you");
      err.statusCode = 403;
      throw err;
    }

    if (order.status !== "Delivered") {
      const err = new Error("You can only review delivered orders");
      err.statusCode = 400;
      throw err;
    }

    const hasProduct = order.cartItems.some(
      (item) => item.productId?.toString() === productId
    );
    if (!hasProduct) {
      const err = new Error("This product is not in the order");
      err.statusCode = 400;
      throw err;
    }

    // 4. Check for duplicate review
    const existing = await Review.findOne({ userId, productId });
    if (existing) {
      const err = new Error("You already reviewed this product");
      err.statusCode = 400;
      throw err;
    }

    // 5. Save review
    const review = await Review.create({
      userId,
      productId,
      orderId,
      rating,
      comment: comment.trim(),
    });

    // 6. Recalculate product average rating
    await this.#updateProductRating(productId);

    return review;
  }

  // ── Update an existing review ──────────────────────────────────────────
  async updateReview({ reviewId, rating, comment, userId }) {
    if (!rating || rating < 1 || rating > 5) {
      const err = new Error("Rating must be between 1 and 5");
      err.statusCode = 400;
      throw err;
    }

    if (!comment?.trim()) {
      const err = new Error("Comment is required");
      err.statusCode = 400;
      throw err;
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      const err = new Error("Review not found");
      err.statusCode = 404;
      throw err;
    }

    if (review.userId.toString() !== userId.toString()) {
      const err = new Error("Not authorized to edit this review");
      err.statusCode = 403;
      throw err;
    }

    review.rating  = rating;
    review.comment = comment.trim();
    await review.save();

    await this.#updateProductRating(review.productId);

    return review;
  }

  // ── Delete a review ────────────────────────────────────────────────────
  async deleteReview({ reviewId, userId }) {
    const review = await Review.findById(reviewId);
    if (!review) {
      const err = new Error("Review not found");
      err.statusCode = 404;
      throw err;
    }

    if (review.userId.toString() !== userId.toString()) {
      const err = new Error("Not authorized to delete this review");
      err.statusCode = 403;
      throw err;
    }

    const { productId } = review;
    await review.deleteOne();

    await this.#updateProductRating(productId);
  }

  // ── Private: recalculate avgRating on the Product document ────────────
  // # makes it a private class method (Node 12+)
  async #updateProductRating(productId) {
    const reviews = await Review.find({ productId });

    const avg =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await Product.findByIdAndUpdate(productId, {
      avgRating:    parseFloat(avg.toFixed(1)),
      totalReviews: reviews.length,
    });
  }
}

export default new ReviewService();
