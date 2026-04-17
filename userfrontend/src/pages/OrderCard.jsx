import { memo } from "react";
import { Link } from "react-router-dom";

const statusSteps = ["Pending", "Confirmed", "Shipped", "Delivered"];

const OrderCard = memo(({ order }) => {
  const currentStep           = statusSteps.indexOf(order.status);
  const isCancelledOrReturned = ["Cancelled", "Returned", "Failed"].includes(order.status);

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
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
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
            {order.status === "Cancelled" && "This order was cancelled"}
            {order.status === "Returned"  && "Return requested — refund credited to wallet"}
            {order.status === "Failed"    && "This order failed"}
          </p>
        </div>
      )}

      {/* ── Summary row: items count · total · payment · View Details ── */}
      <div className="px-4 py-3 flex justify-between items-center flex-wrap sm:flex-nowrap gap-2">
        <div className="text-sm text-gray-600 flex flex-wrap gap-x-2 gap-y-1">
          <span>{order.cartItems?.length ?? 0} item(s)</span>
          <span>·</span>
          <span className="font-semibold text-black">₹{order.total}</span>
          <span>·</span>
          <span>{getPaymentLabel()}</span>
        </div>

        <Link
          to={`/orders/${order._id}`}
          className="text-xs text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
        >
          View Details
        </Link>
      </div>

    </div>
  );
});

export default OrderCard;