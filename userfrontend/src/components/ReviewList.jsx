// src/components/ReviewList.jsx

import { useParams } from "react-router-dom";
import useReview from "../hook/useReview";

// ── Star display helper ──────────────────────────────────────────────────
const Stars = ({ rating, size = "text-base" }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        className={`${size} ${s <= rating ? "text-amber-400" : "text-gray-300"}`}
      >
        ★
      </span>
    ))}
  </div>
);

// ── Average rating bar ───────────────────────────────────────────────────
const RatingBar = ({ star, count, total }) => {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span className="w-6 text-right">{star}★</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="bg-amber-400 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-6">{count}</span>
    </div>
  );
};

// ── Single review card ───────────────────────────────────────────────────
const ReviewCard = ({ review }) => {
  const initial = review.user?.name?.[0]?.toUpperCase() || "U";
  const date = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
      {/* Header: avatar + name + date */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {review.user?.name || "Anonymous"}
          </p>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
        {/* "Verified Purchase" badge */}
        <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full flex-shrink-0">
          Verified
        </span>
      </div>

      {/* Stars */}
      <Stars rating={review.rating} size="text-sm" />

      {/* Comment */}
      {review.comment && (
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  );
};

// ── Main ReviewList ──────────────────────────────────────────────────────
const ReviewList = () => {
  const { id: productId } = useParams();
  const { reviews, avgRating, loading } = useReview(productId);

  // Build per-star counts for the breakdown bar
  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  // ── Loading skeleton ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-4 bg-white">
            <div className="flex gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-4/5 mt-1" />
          </div>
        ))}
      </div>
    );
  }

  // ── No reviews yet ───────────────────────────────────────────────────
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
        <p className="text-4xl mb-3">⭐</p>
        <p className="text-gray-500 font-medium">No reviews yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Be the first to review this product!
        </p>
      </div>
    );
  }

  // ── Full list ────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Rating Summary ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">

          {/* Left: big number + stars */}
          <div className="text-center min-w-[80px]">
            <p className="text-5xl font-bold text-gray-800">
              {avgRating.toFixed(1)}
            </p>
            <Stars rating={Math.round(avgRating)} size="text-lg" />
            <p className="text-xs text-gray-400 mt-1">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Right: bar breakdown */}
          <div className="flex-1 w-full space-y-1.5">
            {starCounts.map(({ star, count }) => (
              <RatingBar
                key={star}
                star={star}
                count={count}
                total={reviews.length}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Individual Reviews ── */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewList;