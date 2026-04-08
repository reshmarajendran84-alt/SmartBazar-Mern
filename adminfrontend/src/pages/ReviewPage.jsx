import { useEffect, useState } from "react";
// import StarRating from "../components/StarRating";
import api from "../utils/api";
import { getAllReviews, deleteReview } from "../services/reviewService";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   getAllReviews()
      .then(res => setReviews(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await deleteReview(id);
    setReviews(prev => prev.filter(r => r._id !== id));
  };

  if (loading) return <p className="p-6 text-gray-400">Loading reviews...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Reviews</h1>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
         <thead className="bg-gray-50 border-b">
  <tr>
    {["User", "Product", "Rating", "Comment", "Date", "Action"].map(h => (
      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
        {h}
      </th>
    ))}
  </tr>
</thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{r.userId?.name}</td>
                <td className="px-4 py-3">{r.productId?.name}</td>
                {/* <td className="px-4 py-3"><StarRating value={r.rating} readOnly size={16} /></td> */}
               <td className="px-4 py-3">{r.rating} ⭐</td> {/* ✅ added */}
      <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{r.comment || "—"}</td>
      <td className="px-4 py-3 text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
      <td className="px-4 py-3">
                  <button onClick={() => handleDelete(r._id)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}