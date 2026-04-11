import { useState } from "react";
import { toast } from "react-toastify";
import { useAdminOrders } from "../context/OrderContext";

const STATUS_OPTIONS = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const STATUS_COLORS = {
  Pending:   "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Shipped:   "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
  Failed:    "bg-red-100 text-red-600",
};

const OrderRow = ({ order }) => {
  const { updateOrderStatus } = useAdminOrders();
  // Gets the update function from context 

  const [updating, setUpdating] = useState(false);
  // Local loading state just for this row's dropdown

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === order.status) return; // no change, do nothing

    setUpdating(true);
    try {
      await updateOrderStatus(order._id, newStatus);
      // Context automatically updates the orders array in state
      // This row re-renders with the new status — no page refresh
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition">

      {/* Order ID */}
      <td className="px-4 py-3">
        <span className="font-mono text-xs text-gray-500">
          #{order._id?.slice(-8).toUpperCase()}
        </span>
      </td>

      {/* Customer name + email — populated from User model */}
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-gray-800">
          {order.userId?.name || "Unknown"}
        </p>
        <p className="text-xs text-gray-400">
          {order.userId?.email || ""}
        </p>
      </td>

      {/* Order date */}
      <td className="px-4 py-3 text-sm text-gray-500">
        {new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        })}
      </td>

      {/* Total amount */}
      <td className="px-4 py-3 text-sm font-semibold text-gray-800">
        ₹{order.total}
      </td>

      {/* Payment method */}
      <td className="px-4 py-3 text-sm text-gray-500">
        {order.paymentMethod}
      </td>

      {/* Current status badge */}
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium
          ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
          {order.status}
        </span>
      </td>

      {/* Status dropdown — admin changes status here */}
      <td className="px-4 py-3">
        <select
          value={order.status}
          onChange={handleStatusChange}
          disabled={updating}
          className={`text-xs border border-gray-200 rounded-lg px-2 py-1.5
            focus:outline-none focus:ring-2 focus:ring-indigo-300
            ${updating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {updating && (
          <span className="text-xs text-gray-400 ml-2 animate-pulse">
            saving...
          </span>
        )}
      </td>

    </tr>
  );
};

export default OrderRow;