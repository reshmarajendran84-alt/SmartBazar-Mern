import { useEffect } from "react";
import { useReviewContext } from "../context/ReviewContext";

export default function useReview(productId) {
  const ctx = useReviewContext();

  useEffect(() => {
    if (!productId) return;
    ctx.fetchProductReviews(productId);
    ctx.fetchUserReview(productId);
  }, [productId]); // runs when productId changes

  return ctx;
}