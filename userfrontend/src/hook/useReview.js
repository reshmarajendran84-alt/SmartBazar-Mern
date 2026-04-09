import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const useReview = (productId) => {
  const [reviews,    setReviews]    = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [avgRating,  setAvgRating]  = useState(0);
  const [loading,    setLoading]    = useState(true);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/reviews/${productId}`);
      setReviews(data.reviews || []);
      setAvgRating(data.avgRating || 0);
      const mine = (data.reviews || []).find(r => r.isOwner === true);
      setUserReview(mine || null);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const submitReview = async ({ rating, comment, orderId }) => {
    const { data } = await api.post("/reviews", { productId, orderId, rating, comment });
    await fetchReviews();
    return data;
  };

  const editReview = async (reviewId, { rating, comment }) => {
    const { data } = await api.put(`/reviews/${reviewId}`, { rating, comment });
    await fetchReviews();
    return data;
  };

  const deleteReview = async (reviewId) => {
    await api.delete(`/reviews/${reviewId}`);
    await fetchReviews();
  };

  return { reviews, userReview, avgRating, loading, fetchReviews, submitReview, editReview, deleteReview };
};

export default useReview;