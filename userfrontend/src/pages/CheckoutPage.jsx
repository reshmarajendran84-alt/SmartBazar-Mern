import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createOrder, verifyPayment } from "../services/orderService";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const location = useLocation();
  const {
    cartItems = [],
    subtotal = 0,
    shipping = 0,
    tax = 0,
    discount = 0,
    total = 0,
    appliedCoupon = null,
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState("My saved address");
  const [loading, setLoading] = useState(false);

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // 1️⃣ Create order in backend
      const { data } = await createOrder({
        cartItems,
        subtotal,
        shipping,
        tax,
        discount,
        total,
        address,
        paymentMethod,
        coupon: appliedCoupon || "",
      });

      // 2️⃣ If Cash on Delivery
      if (paymentMethod === "COD") {
        toast.success("Order placed successfully!");
      } else if (paymentMethod === "ONLINE") {
        // 3️⃣ Load Razorpay script
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          toast.error("Razorpay SDK failed to load. Are you online?");
          return;
        }

        // 4️⃣ Razorpay options
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Must be defined in .env
          amount: data.razorpayOrder.amount, // in paise
          currency: "INR",
          order_id: data.razorpayOrder.id,
          handler: async (response) => {
            try {
              await verifyPayment({ ...response, orderId: data.orderId });
              toast.success("Payment successful!");
                        console.log("FRONTEND KEY:", import.meta.env.VITE_RAZORPAY_KEY_ID);

            } catch (err) {
              console.error("Payment verification error:", err);
              toast.error("Payment verification failed!");
            }
          },
          prefill: {
            name: "User Name", // replace with actual user data
            email: "user@example.com", // replace with actual user data
          },
          theme: { color: "#4f46e5" },
        };

        // 5️⃣ Open Razorpay Checkout
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error("Order creation error:", err);
      toast.error("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {/* Payment Method */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Payment Method</h3>
        <label className="mr-4">
          <input
            type="radio"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />{" "}
          Cash on Delivery
        </label>
        <label>
          <input
            type="radio"
            value="ONLINE"
            checked={paymentMethod === "ONLINE"}
            onChange={() => setPaymentMethod("ONLINE")}
          />{" "}
          Online Payment
        </label>
      </div>

      {/* Delivery Address */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Delivery Address</h3>
        <p>{address}</p>
      </div>

      {/* Order Summary */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Shipping: ₹{shipping}</p>
        <p>Tax: ₹{tax}</p>
        <p>Discount: ₹{discount}</p>
        <p className="font-bold">Total: ₹{total}</p>
        {appliedCoupon && <p className="text-green-600">Coupon Applied: {appliedCoupon}</p>}
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default CheckoutPage;
