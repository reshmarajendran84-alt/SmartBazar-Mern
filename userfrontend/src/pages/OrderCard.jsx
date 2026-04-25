import { memo } from "react";
import { Link } from "react-router-dom";

const statusSteps = ["Pending", "Confirmed", "Shipped", "Delivered"];

const OrderCard = memo(({ order }) => {
  const currentStep = statusSteps.indexOf(order.status);
  const isCancelledOrReturned = ["Cancelled", "Returned", "Failed"].includes(order.status);

  const getPaymentLabel = () => {
    switch (order.paymentMethod) {
      case "COD": return "Cash on Delivery";
      case "WALLET": return "Wallet";
      case "ONLINE": return "Online Payment";
      default: return "Unknown";
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
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 border-b">
        <div>
          <p className="text-xs text-gray-400 font-mono">
            #{order._id?.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold self-start sm:self-auto ${getStatusBadgeClass()}`}
        >
          {order.status}
        </span>
      </div>

      {/* PROGRESS BAR */}
      {!isCancelledOrReturned ? (
        <div className="px-3 sm:px-4 py-4 bg-gray-50 overflow-x-auto">
          <div className="relative min-w-[300px]">
            {/* Background line */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded" />

            {/* Active line */}
            <div
              className="absolute top-4 left-0 h-1 bg-indigo-600 rounded transition-all duration-500"
              style={{
                width: `${Math.max(
                  0,
                  (currentStep / (statusSteps.length - 1)) * 100
                )}%`,
              }}
            />

            {/* Steps */}
            <div className="flex justify-between">
              {statusSteps.map((step, idx) => (
                <div
                  key={step}
                  className="flex flex-col items-center text-center w-full"
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
                    text-xs font-bold border-2 z-10
                    ${
                      idx <= currentStep
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {idx < currentStep ? "✓" : idx + 1}
                  </div>

                  <span
                    className={`text-[10px] sm:text-xs mt-1 font-medium
                    ${
                      idx <= currentStep
                        ? "text-indigo-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 bg-red-50 text-center">
          <p className="text-sm text-red-500 font-medium">
            {order.status === "Cancelled" && "This order was cancelled"}
            {order.status === "Returned" &&
              "Return requested — refund credited to wallet"}
            {order.status === "Failed" && "This order failed"}
          </p>
        </div>
      )}

      {/* FOOTER */}
      <div className="px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* LEFT INFO */}
        <div className="text-sm text-gray-600 flex flex-wrap gap-2">
          <span>{order.cartItems?.length ?? 0} item(s)</span>
          <span>•</span>
          <span className="font-semibold text-gray-900">₹{order.total}</span>
          <span>•</span>
          <span>{getPaymentLabel()}</span>
        </div>

        {/* BUTTON */}
        <Link
          to={`/orders/${order._id}`}
          className="text-xs sm:text-sm text-white bg-indigo-600 px-4 py-2 rounded-lg 
                     hover:bg-indigo-700 transition text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
});

export default OrderCard;