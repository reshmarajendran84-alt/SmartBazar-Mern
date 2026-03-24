import { useState, memo, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

const OrderCard = memo(({ order, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleCancel = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.post(`/order/cancel/${order._id}`);
      toast.success("Order cancelled successfully!");
      onCancel(data.order);
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error(err?.response?.data?.message || "Cancel failed!");
    } finally {
      setLoading(false);
    }
  }, [order._id, onCancel]);

  return (
    <div className="border p-4 rounded mb-3 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm text-gray-500">Order ID: {order._id}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium
          ${order.status === "Paid" ? "bg-green-100 text-green-700" :
            order.status === "Cancelled" ? "bg-red-100 text-red-700" :
            order.status === "Failed" ? "bg-red-100 text-red-600" :
            "bg-yellow-100 text-yellow-700"}`}>
          {order.status}
        </span>
      </div>

      {/* ✅ correct field: paymentMethod */}
      <p className="text-sm">Payment: <span className="font-medium">{order.paymentMethod}</span></p>

      {/* ✅ correct fields: subtotal, shipping, tax, discount, total */}
      <div className="text-sm mt-1 space-y-0.5 text-gray-600">
        <p>Subtotal: ₹{order.subtotal}</p>
        <p>Shipping: ₹{order.shipping}</p>
        <p>Tax: ₹{order.tax}</p>
        {order.discount > 0 && <p>Discount: -₹{order.discount}</p>}
        <p className="font-semibold text-black">Total: ₹{order.total}</p>
      </div>

      {/* ✅ correct field: cartItems */}
      <div className="mt-3">
        <p className="font-medium text-sm mb-1">Items:</p>
        {order.cartItems?.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm text-gray-600">
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      {/* ✅ correct status value: "Pending" not "PLACED" */}
      {order.status === "Pending" && (
        <button
          onClick={handleCancel}
          disabled={loading}
          className={`mt-3 bg-red-500 text-white px-3 py-1 rounded text-sm
            ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"}`}
        >
          {loading ? "Cancelling..." : "Cancel Order"}
        </button>
      )}
    </div>
  );
});

export default OrderCard;