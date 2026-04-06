import { memo } from "react";
import StarRating from "./StarRating";

const ReviewCard = memo(({ review }) => (
  <div style={{ borderBottom: "1px solid #f1f5f9", padding: "14px 0" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#4f46e5", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
          {review.userId?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: 14 }}>{review.userId?.name || "User"}</p>
          {review.isVerified && (
            <span style={{ fontSize: 11, color: "#059669" }}>✔ Verified Purchase</span>
          )}
        </div>
      </div>
      <span style={{ fontSize: 12, color: "#94a3b8" }}>
        {new Date(review.createdAt).toLocaleDateString()}
      </span>
    </div>
    <StarRating value={review.rating} readOnly size={18} />
    {review.comment && (
      <p style={{ fontSize: 14, color: "#374151", marginTop: 6 }}>{review.comment}</p>
    )}
  </div>
));

export default ReviewCard;