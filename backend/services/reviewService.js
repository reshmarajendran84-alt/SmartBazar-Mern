import Review from "../models/Review.js";
import Order  from "../models/Order.js";
import Product from "../models/Product.js";

class ReviewService {

  async getReviewsByProduct(productId, currentUserId = null) {
    // Public sees only approved; user always sees their own (any status)
    const query = currentUserId
      ? { productId, $or: [{ status: "approved" }, { userId: currentUserId }] }
      : { productId, status: "approved" };

    const reviews = await Review.find(query)
      .populate("userId", "name email")
        .populate("productId", "name")
       .sort({ createdAt: -1 });

    const approvedOnly = reviews.filter(r => r.status === "approved");
    const avgRating =
      approvedOnly.length > 0
        ? approvedOnly.reduce((sum, r) => sum + r.rating, 0) / approvedOnly.length
        : 0;

    const shaped = reviews.map((r) => ({
      _id:       r._id,
      rating:    r.rating,
      comment:   r.comment,
      createdAt: r.createdAt,
      status:    r.status,   
      isOwner:   currentUserId
                   ? r.userId._id.toString() === currentUserId.toString()
                   : false,
      user: { name: r.userId.name || r.userId.email?.split("@")[0] },

    }));

    return { reviews: shaped, avgRating: parseFloat(avgRating.toFixed(1)) };
  }

  async createReview({ productId, orderId, rating, comment, userId }) {
    if (!rating || rating < 1 || rating > 5) {
      const err = new Error("Rating must be between 1 and 5"); err.statusCode = 400; throw err;
    }
    if (!comment?.trim()) {
      const err = new Error("Comment is required"); err.statusCode = 400; throw err;
    }

    const order = await Order.findById(orderId);
    if (!order) { const err = new Error("Order not found"); err.statusCode = 404; throw err; }
    if (order.userId.toString() !== userId.toString()) {
      const err = new Error("This order does not belong to you"); err.statusCode = 403; throw err;
    }
    if (order.status !== "Delivered") {
      const err = new Error("You can only review delivered orders"); err.statusCode = 400; throw err;
    }
    const hasProduct = order.cartItems.some(item => item.productId?.toString() === productId);
    if (!hasProduct) {
      const err = new Error("This product is not in the order"); err.statusCode = 400; throw err;
    }

    const existing = await Review.findOne({ userId, productId });
    if (existing) {
      const err = new Error("You already reviewed this product"); err.statusCode = 400; throw err;
    }

    // status defaults to "pending" — admin must approve
    const review = await Review.create({ userId, productId, orderId, rating, comment: comment.trim() });
    await this.#updateProductRating(productId);
    return review;
  }

  async updateReview({ reviewId, rating, comment, userId }) {
    if (!rating || rating < 1 || rating > 5) {
      const err = new Error("Rating must be between 1 and 5"); err.statusCode = 400; throw err;
    }
    if (!comment?.trim()) {
      const err = new Error("Comment is required"); err.statusCode = 400; throw err;
    }

    const review = await Review.findById(reviewId);
    if (!review) { const err = new Error("Review not found"); err.statusCode = 404; throw err; }
    if (review.userId.toString() !== userId.toString()) {
      const err = new Error("Not authorized to edit this review"); err.statusCode = 403; throw err;
    }

    review.rating  = rating;
    review.comment = comment.trim();
    review.status  = "pending"; 
    await review.save();
    await this.#updateProductRating(review.productId);
    return review;
  }

  async deleteReview({ reviewId, userId }) {
    const review = await Review.findById(reviewId);
    if (!review) { const err = new Error("Review not found"); err.statusCode = 404; throw err; }
    if (review.userId.toString() !== userId.toString()) {
      const err = new Error("Not authorized to delete this review"); err.statusCode = 403; throw err;
    }
    const { productId } = review;
    await review.deleteOne();
    await this.#updateProductRating(productId);
  }

  async #updateProductRating(productId) {
    const reviews = await Review.find({ productId, status: "approved" }); 
    const avg = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    await Product.findByIdAndUpdate(productId, {
      avgRating:    parseFloat(avg.toFixed(1)),
      totalReviews: reviews.length,
    });
  }
}

export default new ReviewService();