


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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
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
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-lg mx-auto transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Success Banner */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center mb-6">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-2xl font-bold text-green-700">Order Confirmed!</h1>
          <p className="text-sm text-green-600 mt-1">
            Thank you! Your order has been placed successfully.
          </p>
          <p className="text-xs text-gray-400 mt-2 font-mono">
            Order ID: {order._id}
          </p>
        </div>

        {/* Delivery Status Tracker */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Delivery Status</h2>
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-indigo-500 z-0 transition-all duration-700"
              style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
            />
            {statusSteps.map((step, idx) => (
              <div key={step} className="flex flex-col items-center z-10 gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    idx <= currentStep
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {idx < currentStep ? "✓" : idx + 1}
                </div>
                <span
                  className={`text-xs font-medium ${
                    idx <= currentStep ? "text-indigo-600" : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {order.cartItems?.length ? (
              order.cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-700">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No items found.</p>
            )}
          </div>

          {/* Totals */}
          <div className="space-y-1 text-sm text-gray-600 border-t pt-3">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>₹{order.shipping}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{order.tax}</span></div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span><span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-black border-t pt-2 mt-1">
              <span>Total</span><span>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Payment & Address */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className="font-medium">
              {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online (Razorpay)"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {order.status}
            </span>
          </div>
          {order.address && (
            <div className="flex justify-between">
              <span className="text-gray-500">Deliver to</span>
              <span className="font-medium text-right">
                {order.address.addressLine}, {order.address.city}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 border border-indigo-600 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/my-orders")}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;