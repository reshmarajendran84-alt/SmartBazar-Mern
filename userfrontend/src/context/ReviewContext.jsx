import { createContext, useContext, useState, useCallback } from "react";
import * as reviewService from "../services/reviewService";

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews]           = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview]     = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const fetchProductReviews = useCallback(async (productId) => {
    setLoading(true);
    try {
      const data = await reviewService.getProductReviews(productId);
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);
    } catch {
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserReview = useCallback(async (productId) => {
    try {
      const data = await reviewService.getUserReview(productId);
      setUserReview(data);
    } catch {
      setUserReview(null);
    }
  }, []);

  const submitReview = useCallback(async (payload) => {
    const saved = await reviewService.submitReview(payload);
    setUserReview(saved);
    // Refresh reviews after submit
    await fetchProductReviews(payload.productId);
  }, [fetchProductReviews]);

  return (
    <ReviewContext.Provider value={{
      reviews, averageRating, totalReviews,
      userReview, loading, error,
      fetchProductReviews, fetchUserReview, submitReview,
    }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviewContext = () => useContext(ReviewContext);