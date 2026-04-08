// src/hook/useReview.js

import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const useReview = (productId) => {
  const [reviews, setReviews]       = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [avgRating, setAvgRating]   = useState(0);
  const [loading, setLoading]       = useState(true);

  const [rating, setRating]   = useState(0);
const [comment, setComment] = useState("");

useEffect(() => {
  if (userReview) {
    setRating(userReview.rating);
    setComment(userReview.comment);
  }
}, [userReview]);
  // ── Fetch all reviews for this product ──────────────────────────────
  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/reviews/${productId}`);
      /*
        Backend should return:
        {
          reviews: [ { _id, userId, rating, comment, createdAt, user: { name } } ],
          avgRating: 4.2
        }
      */
      setReviews(data.reviews || []);
      setAvgRating(data.avgRating || 0);

      // Check if the current logged-in user already reviewed this product
      const token = localStorage.getItem("token");
      if (token) {
        // Decode userId from token or compare via API flag
        // Here we rely on backend sending isOwner or we match via a separate call
        const existing = data.reviews?.find((r) => r.isOwner === true);
        setUserReview(existing || null);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // ── Submit a new review ──────────────────────────────────────────────
  const submitReview = async ({ rating, comment, orderId }) => {
    /*
      POST /review
      Body: { productId, orderId, rating, comment }
    */
    const { data } = await api.post("/reviews", {
      productId,
      orderId,
      rating,
      comment,
    });
    await fetchReviews(); // refresh list after submit
    return data;
  };

  // ── Edit existing review ─────────────────────────────────────────────
  const editReview = async (reviewId, { rating, comment }) => {
    const { data } = await api.put(`/reviews/${reviewId}`, { rating, comment });
    await fetchReviews();
    return data;
  };

  // ── Delete a review ──────────────────────────────────────────────────
  const deleteReview = async (reviewId) => {
    await api.delete(`/reviews/${reviewId}`);
    await fetchReviews();
  };

  return {
    reviews,
    userReview,
    avgRating,
    loading,
    fetchReviews,
    submitReview,
    editReview,
    deleteReview,
  };
};

export default useReview;