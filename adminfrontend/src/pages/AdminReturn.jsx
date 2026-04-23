import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [processingId, setProcessingId] = useState(null);

  const [rejectModal, setRejectModal] = useState({
    open: false,
    orderId: null,
    reason: ""
  });

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/returns?status=${filter}`);
      setReturns(res.data.data || []);
    } catch (error) {
      console.error("Fetch returns error:", error);
      toast.error("Failed to load returns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [filter]);

  //  Use the correct function name
  const handleApprove = async (orderId) => {
    try {
      setProcessingId(orderId);
      // Note: Your route uses POST not PATCH based on your route definition
      const response = await api.post(`/returns/${orderId}/approve`);
      
      if (response.data.success) {
        toast.success(`Return approved! Refund amount: ₹${response.data.refundAmount || 'N/A'}`);
        fetchReturns(); // Refresh the list
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

  //  Use the correct function name
  const handleReject = async () => {
    const { orderId, reason } = rejectModal;
    
    if (!reason || reason.trim() === "") {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setProcessingId(orderId);
      // Note: Your route uses POST not PATCH based on your route definition
      const response = await api.post(`/returns/${orderId}/reject`, {
        rejectionReason: reason
      });
      
      if (response.data.success) {
        toast.success("Return request rejected");
        setRejectModal({ open: false, orderId: null, reason: "" });
        fetchReturns(); // Refresh the list
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Return Management</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        {["pending", "approved", "rejected"].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg ${
              filter === status
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : returns.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No return requests found
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">User Return Reason</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Admin Rejection Reason</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Requested On</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>

              <tbody>
                {returns.map((returnReq) => (
                  <tr key={returnReq._id} className="border-t hover:bg-gray-50">
                    {/* Order ID */}
                    <td className="px-4 py-3 font-mono text-sm">
                      #{returnReq._id?.slice(-8)}
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">
                        {returnReq.userId?.name ||
                          returnReq.address?.fullName ||
                          "Guest"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {returnReq.userId?.email ||
                          returnReq.address?.email ||
                          "N/A"}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      ₹{returnReq.total}
                    </td>

                    {/* User Return Reason */}
                    <td className="px-4 py-3">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                        <p className="text-sm text-gray-800 capitalize font-medium">
                          {returnReq.returnReason?.replace(/_/g, ' ') || (
                            <span className="text-gray-400 italic text-xs">Not recorded</span>
                          )}
                        </p>
                        {returnReq.returnDescription && (
                          <p className="text-xs text-gray-500 mt-1">
                            {returnReq.returnDescription}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Admin Rejection Reason */}
                    <td className="px-4 py-3">
                      {returnReq.returnRejectedAt && returnReq.returnRejectionReason ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                          <p className="text-xs text-red-500 font-semibold mb-1">
                            Rejection Reason:
                          </p>
                          <p className="text-sm text-red-700 font-medium">
                            {returnReq.returnRejectionReason}
                          </p>
                        </div>
                      ) : returnReq.returnRejectedAt && !returnReq.returnRejectionReason ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                          <p className="text-xs text-red-500 font-semibold mb-1">
                            Rejection Reason:
                          </p>
                          <p className="text-sm text-red-400 italic">
                            No reason recorded
                          </p>
                        </div>
                      ) : returnReq.status === "Return_requested" ? (
                        <span className="inline-flex items-center gap-1 text-yellow-600 text-sm">
                          ⏳ Pending review
                        </span>
                      ) : returnReq.status === "Returned" ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                          ✓ Approved — no rejection
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>

                    {/* Requested On */}
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {returnReq.returnRequestedAt
                        ? new Date(returnReq.returnRequestedAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      {returnReq.status === "Return_requested" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(returnReq._id)}
                            disabled={processingId === returnReq._id}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-50"
                          >
                            {processingId === returnReq._id ? "Processing..." : "Approve"}
                          </button>
                          <button
                            onClick={() =>
                              setRejectModal({
                                open: true,
                                orderId: returnReq._id,
                                reason: ""
                              })
                            }
                            disabled={processingId === returnReq._id}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {returnReq.status === "Returned" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          ✓ Refunded
                        </span>
                      )}

                      {returnReq.returnRejectedAt && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                          ✗ Rejected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 max-w-[90%]">
            <h2 className="text-xl font-semibold mb-4">Reject Return Request</h2>

            <p className="text-sm text-gray-600 mb-3">
              Order: <span className="font-mono font-semibold">#{rejectModal.orderId?.slice(-8)}</span>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectModal.reason}
                onChange={(e) =>
                  setRejectModal((prev) => ({
                    ...prev,
                    reason: e.target.value
                  }))
                }
                placeholder="Enter reason for rejecting this return..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                rows="4"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setRejectModal({ open: false, orderId: null, reason: "" })
                }
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processingId === rejectModal.orderId}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {processingId === rejectModal.orderId ? "Processing..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReturns;