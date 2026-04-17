// frontend/src/pages/AdminReturns.jsx
import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  const [rejectModal, setRejectModal] = useState({
    open: false,
    orderId: null,
    reason: ""
  });

  // ── Fetch returns ─────────────────────────────────
  const fetchReturns = async () => {
    try {
      setLoading(true);
      // ✅ Correct endpoint: /returns (baseURL already has /api/admin)
      const res = await api.get(`/returns?status=${filter}`);
      console.log("Fetched returns:", res.data);
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

  // ── Approve ───────────────────────────────────────
  const handleApprove = async (orderId) => {
    if (!window.confirm("Approve this return and process refund?")) return;

    try {
      // ✅ Correct endpoint
      await api.post(`/returns/${orderId}/approve`);
      toast.success("Return approved and refund processed");
      fetchReturns();
    } catch (error) {
      console.error("Approve error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to approve return");
    }
  };

  // ── Reject ────────────────────────────────────────
  const handleReject = async () => {
    if (!rejectModal.reason.trim()) {
      toast.error("Please enter rejection reason");
      return;
    }

    try {
      // ✅ Correct endpoint
      await api.post(`/returns/${rejectModal.orderId}/reject`, {
        rejectionReason: rejectModal.reason
      });

      toast.success("Return request rejected");

      setRejectModal({
        open: false,
        orderId: null,
        reason: ""
      });

      fetchReturns();
    } catch (error) {
      console.error("Reject error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to reject return");
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
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Reason</th>
                <th className="px-4 py-3 text-left">Requested On</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {returns.map((returnReq) => (
                <tr key={returnReq._id} className="border-t">
                  <td className="px-4 py-3">
                    #{returnReq._id.slice(-8)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-medium">
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

                  <td className="px-4 py-3">₹{returnReq.total}</td>

                  <td className="px-4 py-3">
                    <div className="capitalize">
                      {returnReq.returnReason}
                    </div>

                    {returnReq.returnDescription && (
                      <div className="text-sm text-gray-500">
                        {returnReq.returnDescription}
                      </div>
                    )}

                    {/* Show rejection reason */}
                    {returnReq.returnRejectedAt && (
                      <div className="text-sm text-red-500 mt-1">
                        <strong>Rejected:</strong>{" "}
                        {returnReq.returnRejectionReason}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(
                      returnReq.returnRequestedAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    {returnReq.status === "Return_requested" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(returnReq._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            setRejectModal({
                              open: true,
                              orderId: returnReq._id,
                              reason: ""
                            })
                          }
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {returnReq.status === "Returned" && (
                      <span className="text-green-600">
                        Refunded
                      </span>
                    )}

                    {returnReq.returnRejectedAt && (
                      <span className="text-red-600">
                        Rejected
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-lg font-semibold mb-3">
              Reject Return
            </h2>

            <textarea
              value={rejectModal.reason}
              onChange={(e) =>
                setRejectModal((prev) => ({
                  ...prev,
                  reason: e.target.value
                }))
              }
              placeholder="Enter rejection reason..."
              className="w-full border rounded-lg p-2 mb-4"
              rows="3"
            />

            <div className="flex gap-2">
              <button
                onClick={() =>
                  setRejectModal({
                    open: false,
                    orderId: null,
                    reason: ""
                  })
                }
                className="flex-1 border py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReturns;