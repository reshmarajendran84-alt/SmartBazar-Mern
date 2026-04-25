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
  const [mobileViewOpen, setMobileViewOpen] = useState(null);

  const [rejectModal, setRejectModal] = useState({
    open: false,
    orderId: null,
    reason: ""
  });

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/returns`);
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
        return returns.filter(r => r.status === "Rejected" || r.returnRejectedAt);
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
    if (returnReq.status === "Rejected" || returnReq.returnRejectedAt) {
      return { bg: "bg-red-100", text: "text-red-800", icon: FiXCircle, label: "Rejected" };
    }
    if (returnReq.status === "Returned") {
      return { bg: "bg-green-100", text: "text-green-800", icon: FiCheckCircle, label: "Approved" };
    }
    return { bg: "bg-yellow-100", text: "text-yellow-800", icon: FiClock, label: "Pending" };
  };

  const handleApprove = async (orderId) => {
    try {
      setProcessingId(orderId);
      const response = await api.post(`/returns/${orderId}/approve`);
      if (response.data.success) {
        toast.success(`Return approved! Refund: ₹${response.data.refundAmount || 'N/A'}`);
        fetchReturns();
      } else {
        toast.error(response.data.message || "Failed to approve return");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve return");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    const { orderId, reason } = rejectModal;
    if (!reason || reason.trim() === "") {
      toast.error("Please provide a rejection reason");
      return;
    }
    try {
      setProcessingId(orderId);
      const response = await api.post(`/returns/${orderId}/reject`, { rejectionReason: reason });
      if (response.data.success) {
        toast.success("Return request rejected");
        setRejectModal({ open: false, orderId: null, reason: "" });
        fetchReturns();
      } else {
        toast.error(response.data.message || "Failed to reject return");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject return");
    } finally {
      setProcessingId(null);
    }
  };

  const stats = {
    pending: returns.filter(r => r.status === "Return_requested").length,
    approved: returns.filter(r => r.status === "Returned").length,
    rejected: returns.filter(r => r.status === "Rejected" || r.returnRejectedAt).length,
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
          {[
            { key: "pending", label: "Pending", count: stats.pending, color: "yellow", icon: FiClock },
            { key: "approved", label: "Approved", count: stats.approved, color: "green", icon: FiCheckCircle },
            { key: "rejected", label: "Rejected", count: stats.rejected, color: "red", icon: FiXCircle }
          ].map(stat => (
            <div
              key={stat.key}
              onClick={() => setFilter(stat.key)}
              className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                filter === stat.key ? `border-${stat.color}-400 ring-2 ring-${stat.color}-200` : "border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.count}</p>
                </div>
                <div className={`w-10 h-10 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                  <stat.icon className={`text-${stat.color}-600 text-lg`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {["pending", "approved", "rejected"].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 text-sm font-medium transition-all capitalize ${
                  filter === status
                    ? `text-${status === "pending" ? "yellow" : status === "approved" ? "green" : "red"}-600 border-b-2 border-${status === "pending" ? "yellow" : status === "approved" ? "green" : "red"}-600`
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {status} ({stats[status]})
              </button>
            ))}
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
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                                <button onClick={() => handleApprove(returnReq._id)} disabled={processingId === returnReq._id}
                                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                                  Approve
                                </button>
                                <button onClick={() => setRejectModal({ open: true, orderId: returnReq._id, reason: "" })}
                                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                                  Reject
                                </button>
                              </div>
                            )}
                            {returnReq.status === "Returned" && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                <FiCheckCircle /> Refunded
                              </span>
                            )}
                            {(returnReq.status === "Rejected" || returnReq.returnRejectedAt) && (
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

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {currentReturns.map(returnReq => {
                const statusBadge = getStatusBadge(returnReq);
                const StatusIcon = statusBadge.icon;
                return (
                  <div key={returnReq._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-sm font-bold">#{returnReq._id?.slice(-8)}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                        <StatusIcon className="text-xs" />
                        {statusBadge.label}
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-start gap-2">
                        <FiUser className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
                        <div>
                          <p className="text-sm font-medium">{returnReq.userId?.name || returnReq.address?.fullName || "Guest"}</p>
                          <p className="text-xs text-gray-500">{returnReq.userId?.email || returnReq.address?.email}</p>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 text-sm">Amount:</span>
                        <span className="font-semibold">₹{returnReq.total}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">Reason:</span>
                        <p className="text-sm capitalize mt-1">{returnReq.returnReason?.replace(/_/g, ' ')}</p>
                      </div>
                      {returnReq.returnRejectionReason && (
                        <div className="bg-red-50 p-2 rounded-lg">
                          <p className="text-xs text-red-600 font-medium">Rejection Reason:</p>
                          <p className="text-xs text-red-500">{returnReq.returnRejectionReason}</p>
                        </div>
                      )}
                    </div>
                    {returnReq.status === "Return_requested" && (
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button onClick={() => handleApprove(returnReq._id)} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm">
                          Approve
                        </button>
                        <button onClick={() => setRejectModal({ open: true, orderId: returnReq._id, reason: "" })} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm">
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <p className="text-sm text-gray-500">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredReturns.length)} of {filteredReturns.length}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                    className="p-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50">
                    <FiChevronLeft />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1.5 rounded-lg text-sm ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-gray-50'}`}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                    className="p-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50">
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Reject Modal */}
        {rejectModal.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Reject Return Request</h2>
                <textarea
                  value={rejectModal.reason}
                  onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Enter rejection reason..."
                  className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-red-500 outline-none"
                  rows="4"
                />
                <div className="flex gap-3">
                  <button onClick={() => setRejectModal({ open: false, orderId: null, reason: "" })}
                    className="flex-1 border py-2 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button onClick={handleReject} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                    Confirm
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