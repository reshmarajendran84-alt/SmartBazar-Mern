import { useState, memo, useCallback } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import api from "../utils/api";

const statusSteps = ["Pending", "Confirmed", "Shipped", "Delivered"];

const OrderCard = memo(({ order, onCancel, onWalletUpdate }) => {
  const [loading, setLoading]               = useState(false);
  const [expanded, setExpanded]             = useState(false);
  const [refundProcessed, setRefundProcessed] = useState(false);

  // ── Cancel order ────────────────────────────────────────────────────
  const handleCancel = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.patch(`/order/cancel/${order._id}`);
      toast.success("Order cancelled! Refund credited to wallet if applicable.");
      onCancel(data.order);
      if (order.paymentMethod === "ONLINE" || order.paymentMethod === "WALLET") {
        setRefundProcessed(true);
        if (onWalletUpdate) onWalletUpdate();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cancel failed!");
    } finally {
      setLoading(false);
    }
  }, [order._id, order.paymentMethod, onCancel, onWalletUpdate]);

  // ── Return order ─────────────────────────────────────────────────────
  const handleReturn = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.patch(`/order/return/${order._id}`);
      toast.success("Return requested! Refund credited to wallet.");
      onCancel(data.order);
      setRefundProcessed(true);
      if (onWalletUpdate) onWalletUpdate();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Return failed!");
    } finally {
      setLoading(false);
    }
  }, [order._id, onCancel, onWalletUpdate]);

  // ── Helpers ───────────────────────────────────────────────────────────
  const currentStep          = statusSteps.indexOf(order.status);
  const isCancelledOrReturned = ["Cancelled", "Returned", "Failed"].includes(order.status);

  const showRefundNote =
    (isCancelledOrReturned &&
      (order.paymentMethod === "ONLINE" || order.paymentMethod === "WALLET")) ||
    refundProcessed;

  const getPaymentLabel = () => {
    switch (order.paymentMethod) {
      case "COD":    return "Cash on Delivery";
      case "WALLET": return "Wallet";
      case "ONLINE": return "Online Payment";
      default:       return "Unknown";
    }
  };

  const getStatusBadgeClass = () => {
    if (["Delivered", "Confirmed", "Paid"].includes(order.status))
      return "bg-green-100 text-green-700";
    if (["Cancelled", "Failed", "Returned"].includes(order.status))
      return "bg-red-100 text-red-600";
    if (order.status === "Shipped")
      return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="bg-white border rounded-2xl shadow-sm mb-4 overflow-hidden">

      {/* ── Card Header: order ID + date + status badge ── */}
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <p className="text-xs text-gray-400 font-mono">
            #{order._id?.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadgeClass()}`}>
          {order.status}
        </span>
      </div>

      {/* ── Status progress bar ── */}
      {!isCancelledOrReturned ? (
        <div className="px-4 py-4 bg-gray-50">
          <div className="flex items-center justify-between relative">
            {/* Grey background line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
            {/* Filled progress line */}
            <div
              className="absolute top-4 left-0 h-0.5 bg-indigo-500 z-0 transition-all duration-500"
              style={{
                width: `${Math.max(0, (currentStep / (statusSteps.length - 1)) * 100)}%`,
              }}
            />
            {statusSteps.map((step, idx) => (
              <div key={step} className="flex flex-col items-center z-10 gap-1 w-16">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center
                  text-xs font-bold border-2
                  ${idx <= currentStep
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-gray-300 text-gray-400"}`}>
                  {idx < currentStep ? "✓" : idx + 1}
                </div>
                <span className={`text-xs font-medium text-center
                  ${idx <= currentStep ? "text-indigo-600" : "text-gray-400"}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 bg-red-50 text-center">
          <p className="text-sm text-red-500 font-medium">
            {order.status === "Cancelled"  && "This order was cancelled"}
            {order.status === "Returned"   && "Return requested — refund credited to wallet"}
            {order.status === "Failed"     && "This order failed"}
          </p>
        </div>
      )}

      {/* ── Summary row: items count · total · payment · buttons ── */}
      <div className="px-4 py-3 flex justify-between items-center flex-wrap sm:flex-nowrap gap-2">
        <div className="text-sm text-gray-600 flex flex-wrap gap-x-2 gap-y-1">
          <span>{order.cartItems?.length ?? 0} item(s)</span>
          <span>·</span>
          <span className="font-semibold text-black">₹{order.total}</span>
          <span>·</span>
          <span>{getPaymentLabel()}</span>
        </div>

        {/* Action buttons — View Details link + Quick View toggle */}
        <div className="flex items-center gap-3">
         
          
<Link to={`/orders/${order._id}`}
            className="text-xs text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
          >
            View Details
          </Link>
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="text-indigo-600 text-sm font-medium hover:underline"
          >
            {expanded ? "Hide" : "Quick View"}
          </button>
        </div>
      </div>

      {/* ── Expanded quick-view panel ── */}
      {expanded && (
        <div className="px-4 pb-4 border-t pt-3 space-y-3">

          {/* Items list */}
          <div className="space-y-2">
            {order.cartItems?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm text-gray-600">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="border-t pt-2 space-y-1 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>Subtotal</span><span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span><span>₹{order.shipping}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span><span>₹{order.tax}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span><span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-black border-t pt-1">
              <span>Total</span><span>₹{order.total}</span>
            </div>
          </div>

          {/* Delivery address */}
          {order.address && (
            <div className="text-sm text-gray-500 border-t pt-2">
              <span className="font-medium text-gray-700">Deliver to: </span>
              {order.address.fullName && (
                <span className="font-medium text-gray-700">{order.address.fullName} · </span>
              )}
              {order.address.addressLine}, {order.address.city}, {order.address.state} — {order.address.pincode}
              {order.address.phone && (
                <span className="block text-gray-400 text-xs mt-0.5">
                  Phone: {order.address.phone}
                </span>
              )}
            </div>
          )}

          {/* Cancel button — only for Pending orders */}
          {order.status === "Pending" && (
            <button
              onClick={handleCancel}
              disabled={loading}
              className={`w-full mt-2 bg-red-500 text-white py-2 rounded-lg
                text-sm font-medium transition
                ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"}`}
            >
              {loading ? "Cancelling..." : "Cancel Order"}
            </button>
          )}

          {/* Return button — only for Delivered orders */}
          {order.status === "Delivered" && (
            <button
              onClick={handleReturn}
              disabled={loading}
              className={`w-full mt-2 bg-orange-500 text-white py-2 rounded-lg
                text-sm font-medium transition
                ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"}`}
            >
              {loading ? "Processing..." : "Return Order"}
            </button>
          )}

          {/* Refund note — shows after cancel/return for prepaid orders */}
          {showRefundNote && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 text-center">
              <p className="font-semibold">
                Refund of ₹{order.total} has been credited to your wallet
              </p>
              <p className="text-xs text-green-600 mt-1">
                Check your wallet balance to see the updated amount
              </p>
            </div>
          )}

          {/* Loading indicator while API call in progress */}
          {loading && (
            <p className="text-center text-sm text-gray-400 animate-pulse">
              Processing...
            </p>
          )}

        </div>
      )}
    </div>
  );
});

export default OrderCard;