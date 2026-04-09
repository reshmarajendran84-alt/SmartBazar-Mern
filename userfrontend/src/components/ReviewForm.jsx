import { useState, useEffect } from "react";   
import { toast } from "react-toastify";
import useReview from "../hook/useReview";

// ── Star selector ────────────────────────────────────────────────────────
const StarSelector = ({ value, onChange, disabled }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-3xl focus:outline-none transition-transform hover:scale-110 disabled:cursor-not-allowed"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <span className={star <= (hovered || value) ? "text-amber-400" : "text-gray-300"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

// ── Rating label ─────────────────────────────────────────────────────────
const ratingLabel = (r) => {
  const labels = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Very Good", 5: "Excellent" };
  return labels[r] || "";
};

// ── Main ReviewForm ───────────────────────────────────────────────────────
const ReviewForm = ({ productId, orderId }) => {
  const { userReview, submitReview, editReview, deleteReview } =
    useReview(productId);

  const [rating, setRating]     = useState(0);
  const [comment, setComment]   = useState("");
  const [submitting, setSubmit] = useState(false);
  const [isEditing, setEditing] = useState(false);

  // Sync form when userReview loads from API
  useEffect(() => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment);
    }
  }, [userReview]);

  // ── Show existing review with Edit / Delete ───────────────────────────
  if (userReview && !isEditing) {
    return (
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-indigo-700">Your Review</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setRating(userReview.rating);
                setComment(userReview.comment);
                setEditing(true);
              }}
              className="text-xs text-indigo-600 border border-indigo-300 px-3 py-1 rounded-lg hover:bg-indigo-100 transition"
            >
              Edit
            </button>
            <button
              onClick={async () => {
                if (!window.confirm("Delete your review?")) return;
                try {
                  await deleteReview(userReview._id);
                  toast.success("Review deleted");
                } catch {
                  toast.error("Failed to delete review");
                }
              }}
              className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className={`text-xl ${s <= userReview.rating ? "text-amber-400" : "text-gray-300"}`}
            >
              ★
            </span>
          ))}
          <span className="text-sm text-gray-500 ml-1">
            {ratingLabel(userReview.rating)}
          </span>
        </div>

        <p className="text-sm text-gray-700">{userReview.comment}</p>
      </div>
    );
  }

  // ── Submit handler ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) return toast.error("Please select a star rating");
    if (!comment.trim()) return toast.error("Please write a comment");

    setSubmit(true);
    try {
      if (isEditing && userReview) {
        await editReview(userReview._id, { rating, comment: comment.trim() });
        toast.success("Review updated!");
        setEditing(false);
      } else {
        await submitReview({ rating, comment: comment.trim(), orderId });
        toast.success("Review submitted! Thank you.");
        setRating(0);
        setComment("");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmit(false);
    }
  };

  // ── Form ──────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm"
    >
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        {isEditing ? "Edit Your Review" : "Write a Review"}
      </h3>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Your Rating</p>
        <div className="flex items-center gap-3">
          <StarSelector value={rating} onChange={setRating} disabled={submitting} />
          {rating > 0 && (
            <span className="text-sm text-amber-600 font-medium">
              {ratingLabel(rating)}
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm text-gray-500 block mb-1">Your Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={submitting}
          placeholder="Share your experience with this product..."
          rows={4}
          maxLength={500}
          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-400
                     resize-none disabled:opacity-60"
        />
        <p className="text-xs text-gray-400 text-right mt-0.5">
          {comment.length}/500
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition
            ${submitting ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {submitting
            ? (isEditing ? "Updating..." : "Submitting...")
            : (isEditing ? "Update Review" : "Submit Review")}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;