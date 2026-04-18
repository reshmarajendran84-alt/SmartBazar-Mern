import { useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

const ReturnRequestModal = ({ order, onClose, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const reasons = [
    { value: "damaged", label: "Product damaged" },
    { value: "wrong_item", label: "Wrong item received" },
    { value: "size_issue", label: "Size issue" },
    { value: "quality_issue", label: "Quality issue" },
    { value: "other", label: "Other" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    setLoading(true);
    try {
await api.post(`/return/request/${order._id}`, {
  reason,
        description
      });
      toast.success("Return request submitted successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit return request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Request Return</h2>
        <p className="text-sm text-gray-600 mb-4">
          Order: #{order._id?.slice(-8).toUpperCase()}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Reason for return</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Select reason</option>
              {reasons.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              rows="3"
              placeholder="Please provide more details..."
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnRequestModal;