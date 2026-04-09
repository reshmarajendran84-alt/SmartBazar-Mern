// admin-frontend/src/pages/ReviewPage.jsx
import { useEffect, useState } from "react";
import { getAllReviews, updateReviewStatus, deleteReview } from "../services/reviewService";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

const STATUS_COLORS = {
  pending:  "bg-amber-50  text-amber-700  border-amber-200",
  approved: "bg-green-50  text-green-700  border-green-200",
  rejected: "bg-red-50    text-red-600    border-red-200",
};

const FILTERS = ["all", "pending", "approved", "rejected"];

export default function ReviewsPage() {
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("pending"); // default: show pending first
  const [updating, setUpdating] = useState(null);      // reviewId being updated

  const load = async (status) => {
    setLoading(true);
    try {
      const res = await getAllReviews(status === "all" ? "" : status);
      setReviews(res.data.data);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(filter); }, [filter]);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await updateReviewStatus(id, status);
      toast.success(`Review ${status}`);
      setReviews(prev =>
        filter === "all"
          ? prev.map(r => r._id === id ? { ...r, status } : r)
          : prev.filter(r => r._id !== id)   // remove from current filtered view
      );
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;
    try {
      await deleteReview(id);
      toast.success("Review deleted");
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const counts = { pending: 0, approved: 0, rejected: 0 };
  reviews.forEach(r => { if (counts[r.status] !== undefined) counts[r.status]++; });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1">Reviews</h1>
      <p className="text-sm text-gray-400 mb-6">Moderate customer reviews before they go public</p>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition border
              ${filter === f
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1,2,3].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl"/>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl text-gray-400">
          No {filter === "all" ? "" : filter} reviews found
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["User", "Product", "Rating", "Comment", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">{r.userId?.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">
                    {r.productId?.name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={s <= r.rating ? "text-amber-400" : "text-gray-200"}>★</span>
                      ))}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">
                    {r.comment || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {/* Approve */}
                      {r.status !== "approved" && (
                        <button
                          onClick={() => handleStatus(r._id, "approved")}
                          disabled={updating === r._id}
                          title="Approve"
                          className="text-green-500 hover:text-green-700 disabled:opacity-40 transition"
                        >
                          <CheckCircle size={17}/>
                        </button>
                      )}
                      {/* Reject */}
                      {r.status !== "rejected" && (
                        <button
                          onClick={() => handleStatus(r._id, "rejected")}
                          disabled={updating === r._id}
                          title="Reject"
                          className="text-amber-500 hover:text-amber-700 disabled:opacity-40 transition"
                        >
                          <XCircle size={17}/>
                        </button>
                      )}
                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(r._id)}
                        title="Delete permanently"
                        className="text-red-400 hover:text-red-600 transition"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}