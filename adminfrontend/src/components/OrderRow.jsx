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
};

const OrderRow = ({ order }) => {
  const { updateOrderStatus } = useAdminOrders();
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === order.status) return;

    setUpdating(true);
    try {
      await updateOrderStatus(order._id, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  // Get customer name from multiple sources
  const getCustomerName = () => {
    // Priority 1: From populated userId
    if (order.userId?.name) return order.userId.name;
    
    // Priority 2: From address.fullName (guest checkout or address field)
    if (order.address?.fullName) return order.address.fullName;
    
    // Priority 3: From address.name (alternative field)
    if (order.address?.name) return order.address.name;
    
    // Priority 4: Fallback
    return "Guest User";
  };

  //  FIX: Get customer email
  const getCustomerEmail = () => {
    if (order.userId?.email) return order.userId.email;
    if (order.address?.email) return order.address.email;
    return "No email";
  };

  //  Get customer phone
  const getCustomerPhone = () => {
    if (order.userId?.phone) return order.userId.phone;
    if (order.address?.phone) return order.address.phone;
    return "";
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      {/* Order ID */}
      <td className="px-4 py-3">
        <span className="font-mono text-xs text-gray-500">
          #{order._id?.slice(-8).toUpperCase()}
        </span>
      </td>

      {/* Customer name + email + phone */}
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-gray-800">
          {getCustomerName()}
        </p>
        <p className="text-xs text-gray-400">
          {getCustomerEmail()}
        </p>
        {getCustomerPhone() && (
          <p className="text-xs text-gray-400">
            📞 {getCustomerPhone()}
          </p>
        )}
      </td>

      {/* Order date */}
      <td className="px-4 py-3 text-sm text-gray-500">
        {new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "numeric", 
          month: "short", 
          year: "numeric",
        })}
      </td>

      {/* Total amount */}
      <td className="px-4 py-3 text-sm font-semibold text-gray-800">
        ₹{(order.total || 0).toLocaleString("en-IN")}
      </td>

      {/* Payment method */}
      <td className="px-4 py-3 text-sm text-gray-500">
        {order.paymentMethod || "N/A"}
      </td>

      {/* Current status badge */}
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium
          ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
          {order.status || "Pending"}
        </span>
      </td>

      {/* Status dropdown */}
      <td className="px-4 py-3">
        <select
          value={order.status || "Pending"}
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