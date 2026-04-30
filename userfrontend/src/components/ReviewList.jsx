import useReview from "../hook/useReview";

const Stars = ({ rating, size = "text-base" }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <span key={s} className={`${size} ${s <= rating ? "text-amber-400" : "text-gray-300"}`}>★</span>
    ))}
  </div>
);

const RatingBar = ({ star, count, total }) => {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span className="w-6 text-right">{star}★</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className="bg-amber-400 h-2 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}/>
      </div>
      <span className="w-6">{count}</span>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  if (status === "approved") return null;
  const styles = {
    pending:  "bg-amber-50 text-amber-600 border-amber-200",
    rejected: "bg-red-50 text-red-500 border-red-200",
  };
  const labels = { pending: "⏳ Awaiting approval", rejected: "✗ Not approved" };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const ReviewCard = ({ review }) => {
  const initial = review.user?.name?.[0]?.toUpperCase() || "U";
  const date = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className={`border rounded-xl p-4 bg-white shadow-sm ${
      review.status === "pending"  ? "border-amber-200 opacity-80" :
      review.status === "rejected" ? "border-red-200  opacity-70" :
      "border-gray-100"
    }`}>
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
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full">
            ✔ Verified
          </span>
          {review.isOwner && <StatusBadge status={review.status} />}
        </div>
      </div>
      <Stars rating={review.rating} size="text-sm" />
      {review.comment && (
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
};

const ReviewList = ({ productId }) => {
  const { reviews, avgRating, loading } = useReview(productId);

  const starCounts = [5,4,3,2,1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star && r.status === "approved").length,
  }));

  const approvedCount = reviews.filter(r => r.status === "approved").length;

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1,2,3].map(i => (
          <div key={i} className="border border-gray-100 rounded-xl p-4 bg-white">
            <div className="flex gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gray-200"/>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3"/>
                <div className="h-3 bg-gray-200 rounded w-1/4"/>
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-24 mb-2"/>
            <div className="h-3 bg-gray-200 rounded w-full"/>
          </div>
        ))}
      </div>
    );
  }

  if (approvedCount === 0 && !reviews.some(r => r.isOwner)) {
    return (
      <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
        <p className="text-4xl mb-3">⭐</p>
        <p className="text-gray-500 font-medium">No reviews yet</p>
        <p className="text-sm text-gray-400 mt-1">Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Rating summary — based on approved only */}
      {approvedCount > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="text-center min-w-[80px]">
              <p className="text-5xl font-bold text-gray-800">{avgRating.toFixed(1)}</p>
              <Stars rating={Math.round(avgRating)} size="text-lg"/>
              <p className="text-xs text-gray-400 mt-1">{approvedCount} review{approvedCount !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex-1 w-full space-y-1.5">
              {starCounts.map(({ star, count }) => (
                <RatingBar key={star} star={star} count={count} total={approvedCount}/>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {reviews.map(review => (
          <ReviewCard key={review._id} review={review}/>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;