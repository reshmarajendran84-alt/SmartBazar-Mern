import { useEffect, useState } from "react";
import { getAllReviews, updateReviewStatus, deleteReview } from "../services/reviewService";
import { toast } from "react-hot-toast";
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Star, 
  User, 
  Mail, 
  Calendar,
  Filter,
  RefreshCw,
  AlertCircle
} from "lucide-react";

const COLOR_MAP = {
  gray:  {
    text: "text-gray-600",
    bg: "bg-gray-100",
    border: "border-gray-400",
    ring: "ring-gray-200",
  },
  amber: {
    text: "text-amber-600",
    bg: "bg-amber-100",
    border: "border-amber-400",
    ring: "ring-amber-200",
  },
  green: {
    text: "text-green-600",
    bg: "bg-green-100",
    border: "border-green-400",
    ring: "ring-green-200",
  },
  red: {
    text: "text-red-600",
    bg: "bg-red-100",
    border: "border-red-400",
    ring: "ring-red-200",
  },
};
const STATUS_COLORS = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  approved: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  rejected: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", dot: "bg-red-500" },
};

const FILTERS = [
  { key: "all", label: "All Reviews", color: "gray" },
  { key: "pending", label: "Pending", color: "amber" },
  { key: "approved", label: "Approved", color: "green" },
  { key: "rejected", label: "Rejected", color: "red" }
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [updating, setUpdating] = useState(null);
  const [stats, setStats] = useState({ all: 0, pending: 0, approved: 0, rejected: 0 });
  const [searchTerm, setSearchTerm] = useState("");

  const load = async (status) => {
    setLoading(true);
    try {
      const res = await getAllReviews(status === "all" ? "" : status);
      const data = res.data.data;
      
      console.log("Fetched reviews:", data);
      data.forEach(review => {
        console.log("Review user data:", {
          reviewId: review._id,
          userId: review.userId,
          userName: review.userId?.name,
          userEmail: review.userId?.email
        });
      });
      
      setReviews(data);
      
      // Calculate stats
      const newStats = {
        all: data.length,
        pending: data.filter(r => r.status === "pending").length,
        approved: data.filter(r => r.status === "approved").length,
        rejected: data.filter(r => r.status === "rejected").length,
      };
      setStats(newStats);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(filter);
  }, [filter]);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await updateReviewStatus(id, status);
      toast.success(`Review ${status}`);
      setReviews(prev =>
        filter === "all"
          ? prev.map(r => r._id === id ? { ...r, status } : r)
          : prev.filter(r => r._id !== id)
      );
      // Update stats
      load(filter);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  // Improved function to get user name
  const getUserName = (review) => {
    // Check if userId exists and has name
    if (review.userId) {
      if (review.userId.name) return review.userId.name;
      if (review.userId.fullName) return review.userId.fullName;
      if (review.userId.username) return review.userId.username;
    }
    
    // Check if there's customer info in address
    if (review.address?.fullName) return review.address.fullName;
    if (review.customerName) return review.customerName;
    
    // Check if user email exists (extract name from email)
    if (review.userId?.email) {
      const emailName = review.userId.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    // Check for guest user
    if (review.guestName) return review.guestName;
    
    // Default fallbacks
    if (review.userId?._id) return `User ${review.userId._id.slice(-6)}`;
    
    return "Guest User";
  };

  // Improved function to get user email
  const getUserEmail = (review) => {
    if (review.userId?.email) return review.userId.email;
    if (review.address?.email) return review.address.email;
    if (review.guestEmail) return review.guestEmail;
    return "No email provided";
  };

  // Get user avatar initial
  const getUserInitial = (review) => {
    const name = getUserName(review);
    if (name === "Guest User") return "👤";
    return name.charAt(0).toUpperCase();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;
    try {
      await deleteReview(id);
      toast.success("Review deleted");
      setReviews(prev => prev.filter(r => r._id !== id));
      load(filter);
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review");
    }
  };

  // Filter reviews by search term
  const filteredReviews = reviews.filter(review => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      getUserName(review).toLowerCase().includes(searchLower) ||
      getUserEmail(review).toLowerCase().includes(searchLower) ||
      review.productId?.name?.toLowerCase().includes(searchLower) ||
      review.comment?.toLowerCase().includes(searchLower)
    );
  });

  const getRatingStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
          <Star
            key={s}
            size={14}
            className={`${s <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} transition-colors`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Reviews Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Moderate customer reviews before they go public
            </p>
          </div>
          <button
            onClick={() => load(filter)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>

        {/* Stats Cards */}
       {/* Stats Cards */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
  {FILTERS.map(filterItem => {
    const colors = COLOR_MAP[filterItem.color];
    return (
      <div
        key={filterItem.key}
        onClick={() => setFilter(filterItem.key)}
        className={`bg-white rounded-xl border p-3 sm:p-4 shadow-sm hover:shadow-md 
          transition-all cursor-pointer ${
          filter === filterItem.key
            ? `${colors.border} ring-2 ${colors.ring}`
            : "border-gray-100"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">{filterItem.label}</p>
            <p className={`text-xl sm:text-2xl font-bold ${colors.text}`}>
              {stats[filterItem.key]}
            </p>
          </div>
          <div className={`w-8 h-8 sm:w-10 sm:h-10 ${colors.bg} rounded-full flex items-center justify-center`}>
            {filterItem.key === "pending"  && <AlertCircle size={18} className={colors.text} />}
            {filterItem.key === "approved" && <CheckCircle size={18} className={colors.text} />}
            {filterItem.key === "rejected" && <XCircle     size={18} className={colors.text} />}
            {filterItem.key === "all"      && <Filter      size={18} className="text-gray-600" />}
          </div>
        </div>
      </div>
    );
  })}
</div>
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by user, product, or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-48"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No reviews found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm ? "Try a different search term" : `No ${filter} reviews available`}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["User", "Product", "Rating", "Comment", "Status", "Date", "Actions"].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredReviews.map(review => {
                      const statusStyle = STATUS_COLORS[review.status];
                      const userName = getUserName(review);
                      const userEmail = getUserEmail(review);
                      const userInitial = getUserInitial(review);
                      
                      return (
                        <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                          {/* User */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                                {userInitial === "👤" ? "👤" : userInitial}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {userName}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Mail size={10} />
                                  {userEmail}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Product */}
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-700 font-medium">
                              {review.productId?.name || "Unknown Product"}
                            </p>
                          </td>

                          {/* Rating */}
                          <td className="px-6 py-4">
                            {getRatingStars(review.rating)}
                          </td>

                          {/* Comment */}
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600 max-w-md line-clamp-2">
                              {review.comment || "No comment provided"}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                              {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar size={12} />
                              {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStatus(review._id, "approved")}
                                disabled={updating === review._id}
                                className="p-1.5 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition disabled:opacity-50"
                                title="Approve"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => handleStatus(review._id, "rejected")}
                                disabled={updating === review._id}
                                className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                                title="Reject"
                              >
                                <XCircle size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(review._id)}
                                disabled={updating === review._id}
                                className="p-1.5 rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tablet and Mobile Views (simplified for brevity - similar to desktop but with better user name display) */}
            <div className="lg:hidden space-y-4">
              {filteredReviews.map(review => {
                const statusStyle = STATUS_COLORS[review.status];
                const userName = getUserName(review);
                const userEmail = getUserEmail(review);
                const userInitial = getUserInitial(review);
                
                return (
                  <div key={review._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                          {userInitial === "👤" ? "👤" : userInitial}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{userName}</p>
                          <p className="text-xs text-gray-500">{userEmail}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                        {review.status}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-xs text-gray-500">Product</p>
                      <p className="text-sm font-medium">{review.productId?.name || "Unknown"}</p>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-xs text-gray-500">Rating</p>
                      {getRatingStars(review.rating)}
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-xs text-gray-500">Comment</p>
                      <p className="text-sm text-gray-700">{review.comment || "No comment"}</p>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleStatus(review._id, "approved")}
                        className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatus(review._id, "rejected")}
                        className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Results Count */}
            {filteredReviews.length > 0 && (
              <div className="mt-4 text-center text-xs text-gray-400">
                Showing {filteredReviews.length} of {reviews.length} reviews
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}