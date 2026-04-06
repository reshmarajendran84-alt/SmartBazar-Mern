import { memo } from "react";
import ReviewCard from "./ReviewCard";
import StarRating from "./StarRating";
import { useReviewContext } from "../context/ReviewContext";

const ReviewList = memo(() => {
  const { reviews, averageRating, totalReviews, loading } = useReviewContext();

  if (loading) return <p style={{ color: "#94a3b8" }}>Loading reviews...</p>;

  return (
    <div>
      {/* Average Rating Summary */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, background: "#f8fafc", padding: 16, borderRadius: 12, border: "1px solid #e2e8f0" }}>
        <span style={{ fontSize: 42, fontWeight: 800, color: "#1a1a2e" }}>{averageRating}</span>
        <div>
          <StarRating value={Math.round(averageRating)} readOnly size={22} />
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{totalReviews} review{totalReviews !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Review Cards */}
      {reviews.length === 0 ? (
        <p style={{ color: "#94a3b8", fontSize: 14 }}>No reviews yet. Be the first!</p>
      ) : (
        reviews.map((r) => <ReviewCard key={r._id} review={r} />)
      )}
    </div>
  );
});

export default ReviewList;