import { memo, useState, useEffect } from "react";
import StarRating from "./StarRating";
import { useReviewContext } from "../context/ReviewContext";

const ReviewForm = memo(({ productId, orderId }) => {
  const { submitReview, userReview } = useReviewContext();
  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);

  // Pre-fill if user already reviewed
  useEffect(() => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment || "");
    }
  }, [userReview]);

  const handleSubmit = async () => {
    if (rating === 0) return alert("Please select a star rating.");
    setSaving(true);
    try {
      await submitReview({ productId, orderId, rating, comment });
      setSuccess(true);
    } catch (err) {
      alert(err.message || "Failed to submit review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
        {userReview ? "Edit Your Review" : "Write a Review"}
      </h3>

      <StarRating value={rating} onChange={setRating} size={30} />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)..."
        maxLength={500}
        rows={3}
        style={{ width: "100%", marginTop: 12, padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, resize: "vertical" }}
      />

      {success && (
        <p style={{ color: "#059669", fontSize: 13, marginTop: 8 }}>
          ✅ Review submitted successfully!
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={saving}
        style={{ marginTop: 12, background: "#4f46e5", color: "white", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
      >
        {saving ? "Saving..." : userReview ? "Update Review" : "Submit Review"}
      </button>
    </div>
  );
});

export default ReviewForm;