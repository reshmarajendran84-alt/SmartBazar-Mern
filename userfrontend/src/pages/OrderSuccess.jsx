import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const statusSteps = ["Pending", "Confirmed", "Shipped", "Delivered"];

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 bg-gray-50">
        <p className="text-red-500 text-lg font-medium">No order found.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Go Home
        </button>
      </div>
    );
  }

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">

      <div
        className={`max-w-2xl mx-auto transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >

        {/* SUCCESS HEADER */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center mb-6">

          {/* Animated Icon */}
          <div className="text-6xl mb-3 animate-bounce">🎉</div>

          <h1 className="text-2xl sm:text-3xl font-bold text-green-600">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Thank you for your purchase. Your order is being processed.
          </p>

          <div className="mt-3 text-xs text-gray-400 font-mono bg-gray-100 inline-block px-3 py-1 rounded">
            #{order._id?.slice(-8).toUpperCase()}
          </div>
        </div>

        {/* TRACKER */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-6">
            Order Progress
          </h2>

          <div className="flex items-center justify-between relative">

            {/* LINE */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded" />
            <div
              className="absolute top-4 left-0 h-1 bg-indigo-600 rounded transition-all duration-700"
              style={{
                width: `${Math.max(
                  0,
                  (currentStep / (statusSteps.length - 1)) * 100
                )}%`,
              }}
            />

            {statusSteps.map((step, idx) => (
              <div key={step} className="flex flex-col items-center z-10 w-16">

                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    idx <= currentStep
                      ? "bg-indigo-600 border-indigo-600 text-white shadow"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {idx < currentStep ? "✓" : idx + 1}
                </div>

                <span
                  className={`text-xs mt-2 text-center ${
                    idx <= currentStep
                      ? "text-indigo-600 font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">
            Order Summary
          </h2>

          <div className="space-y-3">
            {order.cartItems?.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm border-b pb-2 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-800 line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-semibold">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="mt-4 border-t pt-4 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{order.shipping}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{order.tax}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{order.discount}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total</span>
              <span className="text-indigo-600">₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 text-sm space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className="font-medium">
     {     order.paymentMethod === "COD" ? "Cash on Delivery" 
: order.paymentMethod === "WALLET" ? "Wallet Payment"
: "Online Payment"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">
              {order.status}
            </span>
          </div>

          {order.address && (
            <div className="flex justify-between">
              <span className="text-gray-500">Deliver To</span>
              <span className="text-right font-medium">
                {order.address.addressLine}, {order.address.city}
              </span>
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 border border-indigo-600 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/my-orders")}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow"
          >
            View Orders
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;