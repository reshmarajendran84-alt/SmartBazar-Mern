import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import { 
  FiRefreshCw, FiCheckCircle, FiXCircle, FiClock, 
  FiUser, FiMail, FiCalendar, FiAlertCircle,
  FiChevronLeft, FiChevronRight, FiFilter
} from "react-icons/fi";

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [processingId, setProcessingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [rejectModal, setRejectModal] = useState({
    open: false,
    returnId: null,
    reason: ""
  });

  const fetchReturns = async () => {
    try {
      setLoading(true);
      
      const res = await api.get(`/returns`);
      console.log("Fetched returns:", res.data);
      setReturns(res.data.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Fetch returns error:", error);
      toast.error("Failed to load returns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const getFilteredReturns = () => {
    switch(filter) {
      case "pending":
        return returns.filter(r => r.status === "Return_requested");
      case "approved":
        return returns.filter(r => r.status === "Returned");
      case "rejected":
        return returns.filter(r => r.status === "Return_rejected" || r.returnRejectedAt);
      default:
        return returns;
    }
  };

  const filteredReturns = getFilteredReturns();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReturns = filteredReturns.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);

  const getStatusBadge = (returnReq) => {
    if (returnReq.status === "Return_rejected" || returnReq.returnRejectedAt) {
      return { bg: "bg-red-100", text: "text-red-800", icon: FiXCircle, label: "Rejected" };
    }
    if (returnReq.status === "Returned") {
      return { bg: "bg-green-100", text: "text-green-800", icon: FiCheckCircle, label: "Approved" };
    }
    return { bg: "bg-yellow-100", text: "text-yellow-800", icon: FiClock, label: "Pending" };
  };

  const handleApprove = async (returnId) => {
    try {
      setProcessingId(returnId);
    const response = await api.post(`/returns/${returnId}/approve`);
      console.log("Approve response:", response.data);
      if (response.data.success) {
        toast.success(`Return approved! Refund: ₹${response.data.refundAmount || 'N/A'}`);
        await fetchReturns();
      } else {
        toast.error(response.data.message || "Failed to approve return");
      }
    } catch (error) {
      console.error("Approve error:", error);
      toast.error(error.response?.data?.message || "Failed to approve return");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    const { returnId, reason } = rejectModal;
    
    if (!reason || reason.trim() === "") {
      toast.error("Please provide a rejection reason");
      return;
    }
    
    try {
      setProcessingId(returnId);
    const response = await api.post(`/returns/${returnId}/reject`, { 
        rejectionReason: reason 
      });
      console.log("Reject response:", response.data);
      
      if (response.data.success) {
        toast.success("Return request rejected successfully");
        setRejectModal({ open: false, returnId: null, reason: "" });
        await fetchReturns();
      } else {
        toast.error(response.data.message || "Failed to reject return");
      }
    } catch (error) {
      console.error("Reject error:", error);
      toast.error(error.response?.data?.message || "Failed to reject return");
    } finally {
      setProcessingId(null);
    }
  };

  const stats = {
    pending: returns.filter(r => r.status === "Return_requested").length,
    approved: returns.filter(r => r.status === "Returned").length,
    rejected: returns.filter(r => r.status === "Return_rejected" || r.returnRejectedAt).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Return Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage and process customer return requests</p>
          </div>
          <button
            onClick={fetchReturns}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition shadow-sm"
          >
            <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div
            onClick={() => setFilter("pending")}
            className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
              filter === "pending" ? "border-yellow-400 ring-2 ring-yellow-200" : "border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <FiClock className="text-yellow-600 text-lg" />
              </div>
            </div>
          </div>

          <div
            onClick={() => setFilter("approved")}
            className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
              filter === "approved" ? "border-green-400 ring-2 ring-green-200" : "border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheckCircle className="text-green-600 text-lg" />
              </div>
            </div>
          </div>

          <div
            onClick={() => setFilter("rejected")}
            className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
              filter === "rejected" ? "border-red-400 ring-2 ring-red-200" : "border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FiXCircle className="text-red-600 text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 text-sm font-medium transition-all capitalize ${
                filter === "pending"
                  ? "text-yellow-600 border-b-2 border-yellow-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-4 py-2 text-sm font-medium transition-all capitalize ${
                filter === "approved"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-4 py-2 text-sm font-medium transition-all capitalize ${
                filter === "rejected"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-500">Loading returns...</p>
          </div>
        ) : filteredReturns.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <FiAlertCircle className="mx-auto text-gray-400 text-5xl mb-4" />
            <p className="text-gray-500 text-lg">No {filter} return requests found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Order ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Reason</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Requested</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentReturns.map(returnReq => {
                      const statusBadge = getStatusBadge(returnReq);
                      const StatusIcon = statusBadge.icon;
                      return (
                        <tr key={returnReq._id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-mono text-sm">#{returnReq._id?.slice(-8)}</td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium">{returnReq.userId?.name || returnReq.address?.fullName || "Guest"}</p>
                              <p className="text-xs text-gray-500">{returnReq.userId?.email || returnReq.address?.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold">₹{returnReq.total}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm capitalize">{returnReq.returnReason?.replace(/_/g, ' ')}</p>
                            {returnReq.returnRejectionReason && (
                              <p className="text-xs text-red-500 mt-1">Rejected: {returnReq.returnRejectionReason}</p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                              <StatusIcon className="text-xs" />
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(returnReq.returnRequestedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            {returnReq.status === "Return_requested" && (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleApprove(returnReq._id)} 
                                  disabled={processingId === returnReq._id}
                                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-50"
                                >
                                  {processingId === returnReq._id ? "Processing..." : "Approve"}
                                </button>
                                <button 
                                  onClick={() => setRejectModal({ open: true, returnId: returnReq._id, reason: "" })}
                                  disabled={processingId === returnReq._id}
                                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            {returnReq.status === "Returned" && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                <FiCheckCircle /> Refunded
                              </span>
                            )}
                            {(returnReq.status === "Return_rejected" || returnReq.returnRejectedAt) && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                                <FiXCircle /> Rejected
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <p className="text-sm text-gray-500">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredReturns.length)} of {filteredReturns.length} returns
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                    disabled={currentPage === 1}
                    className="p-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    <FiChevronLeft />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition ${
                        currentPage === i + 1 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-white border hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                    disabled={currentPage === totalPages}
                    className="p-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Reject Modal */}
        {rejectModal.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setRejectModal({ open: false, returnId: null, reason: "" });
            }
          }}>
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Reject Return Request</h2>
                  <button 
                    onClick={() => setRejectModal({ open: false, returnId: null, reason: "" })}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <FiXCircle size={20} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Please provide a reason for rejecting this return request.
                </p>
                <textarea
                  value={rejectModal.reason}
                  onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Enter rejection reason..."
                  className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                  rows="4"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => setRejectModal({ open: false, returnId: null, reason: "" })}
                    className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleReject}
                    disabled={processingId === rejectModal.returnId}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
                  >
                    {processingId === rejectModal.returnId ? "Processing..." : "Confirm Rejection"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReturns;