// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useAddress } from "../context/AddressContext";
// import {
//   placeCODOrder,
//   createRazorpayOrder,
//   verifyPayment,
// } from "../services/orderService";

// const loadRazorpayScript = () =>
//   new Promise((resolve) => {
//     if (window.Razorpay) return resolve(true);
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });

// const CheckoutPage = React.memo(() => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const {
//     cartItems = [],
//     subtotal = 0,
//     shipping = 0,
//     tax = 0,
//     discount = 0,
//     total = 0,
//     appliedCoupon = null,
//   } = location.state || {};

//   const { addresses } = useAddress();
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const [loading, setLoading] = useState(false);

//   // Auto-select default address
//   useEffect(() => {
//     if (addresses.length > 0) {
//       const def = addresses.find((a) => a.isDefault) || addresses[0];
//       setSelectedAddressId(def._id);
//     }
//   }, [addresses]);
// useEffect(() => {
//   const fetchOrders = async () => {
//     try {
//       const { data } = await api.get("/order/my-orders");
//       console.log("RAW ORDER DATA:", JSON.stringify(data, null, 2)); // 👈
//       setOrders(data.orders);
//     } catch (err) {
//       console.error("Failed to fetch orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchOrders();
// }, []);
//   const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

//   const orderData = {
//     cartItems: cartItems.map((item) => ({
//       productId: item.productId?._id || item.productId,
//       name: item.productId?.name || item.name,
//       quantity: item.quantity,
//       price: item.price,
//     })),
//     subtotal,
//     shipping,
//     tax,
//     discount,
//     total,
//     address: selectedAddress,
//     coupon: appliedCoupon || "",
//     paymentMethod,
//   };

//   const handlePlaceOrder = async () => {
//     if (!cartItems.length) return toast.error("Cart is empty");
//     if (!selectedAddress) return toast.error("Please select a delivery address");

//     setLoading(true);
//     try {
//    // ── COD ──────────────────────────────────────────
// if (paymentMethod === "COD") {
//   const res = await placeCODOrder(orderData);
//   console.log("COD RESPONSE:", res.data); // remove after testing
//   const order = res.data.order || res.data; // ✅ handles both shapes
//   toast.success("Order placed successfully!");
//   navigate("/order-success", { state: { order } });
//   return;
// }

//       // ── ONLINE ───────────────────────────────────────
//       const isLoaded = await loadRazorpayScript();
//       if (!isLoaded) return toast.error("Razorpay SDK failed to load");

//       const rpRes = await createRazorpayOrder({ amount: total });
//       const rpOrder = rpRes.data.order;

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: rpOrder.amount,
//         currency: "INR",
//         order_id: rpOrder.id,
//         handler: async (response) => {
//   try {
//     const verifyRes = await verifyPayment({
//       razorpay_order_id: response.razorpay_order_id,
//       razorpay_payment_id: response.razorpay_payment_id,
//       razorpay_signature: response.razorpay_signature,
//       orderData,
//     });
//     console.log("VERIFY RESPONSE:", verifyRes.data); // remove after testing
//     const order = verifyRes.data.order || verifyRes.data; // ✅ handles both shapes
//     toast.success("Payment successful!");
//     navigate("/order-success", { state: { order } });
//   } catch (err) {
//     toast.error("Payment verification failed!");
//   }
// },
//         prefill: { name: "", email: "" },
//         theme: { color: "#4f46e5" },
//       };

//       new window.Razorpay(options).open();
//     } catch (err) {
//       console.error("Order error:", err);
//       toast.error(err.response?.data?.message || "Order failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4">
//       <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6">
//         <h2 className="text-2xl font-bold mb-6">Checkout</h2>

//         {/* ── Address selection ── */}
//         <div className="mb-6">
//           <h3 className="font-semibold mb-3">Delivery Address</h3>
//           {addresses.length === 0 ? (
//             <p className="text-sm text-red-500">
//               No address found.{" "}
//               <a href="/user/profile" className="underline text-indigo-600">
//                 Add one in your profile →
//               </a>
//             </p>
//           ) : (
//             addresses.map((addr) => (
//               <label
//                 key={addr._id}
//                 className={`block border rounded-lg p-3 mb-2 cursor-pointer transition ${
//                   selectedAddressId === addr._id
//                     ? "border-indigo-600 bg-indigo-50"
//                     : "border-gray-200"
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name="address"
//                   className="mr-2"
//                   checked={selectedAddressId === addr._id}
//                   onChange={() => setSelectedAddressId(addr._id)}
//                 />
//                 {addr.addressLine}, {addr.city}, {addr.state} — {addr.pincode}
//                 {addr.isDefault && (
//                   <span className="ml-2 text-xs text-green-600">(Default)</span>
//                 )}
//               </label>
//             ))
//           )}
//         </div>

//         {/* ── Order summary ── */}
//         <div className="mb-6 bg-gray-50 rounded-lg p-4 text-sm space-y-1">
//           <h3 className="font-semibold mb-2">Order Summary</h3>
//           <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
//           <div className="flex justify-between"><span>Shipping</span><span>₹{shipping}</span></div>
//           <div className="flex justify-between"><span>Tax</span><span>₹{tax}</span></div>
//           {discount > 0 && (
//             <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{discount}</span></div>
//           )}
//           <div className="flex justify-between font-bold border-t pt-2 mt-2">
//             <span>Total</span><span>₹{total}</span>
//           </div>
//         </div>

//         {/* ── Payment method ── */}
//         <div className="mb-6">
//           <h3 className="font-semibold mb-3">Payment Method</h3>
//           <label className="flex items-center gap-2 mb-2 cursor-pointer">
//             <input
//               type="radio"
//               value="COD"
//               checked={paymentMethod === "COD"}
//               onChange={() => setPaymentMethod("COD")}
//             />
//             Cash on Delivery
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="radio"
//               value="ONLINE"
//               checked={paymentMethod === "ONLINE"}
//               onChange={() => setPaymentMethod("ONLINE")}
//             />
//             Online Payment (Razorpay)
//           </label>
//         </div>

//         <button
//           onClick={handlePlaceOrder}
//           disabled={loading || !selectedAddress}
//           className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition ${
//             loading || !selectedAddress ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {loading ? "Processing..." : `Place Order — ₹${total}`}
//         </button>
//       </div>
//     </div>
//   );
// });

// export default CheckoutPage;


import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddress } from "../context/AddressContext";
import {
  placeCODOrder,
  createRazorpayOrder,
  verifyPayment,
} from "../services/orderService";
import { useCart } from "../context/CartContext";
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const CheckoutPage = React.memo(() => {
  const navigate = useNavigate();
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

  const { addresses } = useAddress();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
const { fetchCart } =useCart();
  // ✅ ONLY this useEffect — auto-select default address
  useEffect(() => {
    if (addresses.length > 0) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(def._id);
    }
  }, [addresses]);


  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

  const orderData = {
    cartItems: cartItems.map((item) => ({
      productId: item.productId?._id || item.productId,
      name: item.productId?.name || item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal,
    shipping,
    tax,
    discount,
    total,
    address: selectedAddress,
    coupon: appliedCoupon || "",
    paymentMethod,
  };

  const handlePlaceOrder = async () => {
    if (!cartItems.length) return toast.error("Cart is empty");
    if (!selectedAddress || !selectedAddress) return toast.error("Please select a delivery address");
console.log("ORDER DATA BEING SENT:", orderData);
  console.log("address:", orderData.address);
  console.log("total:", orderData.total);
  console.log("cartItems:", orderData.cartItems);
    setLoading(true);
    try {
      if (paymentMethod === "COD") {
        const res = await placeCODOrder(orderData);
        await fetchCart();
        console.log("COD RESPONSE:", res.data);
        const order = res.data.order || res.data;
        toast.success("Order placed successfully!");
        navigate("/order-success", { state: { order :res.data.order } });
        return;
      }

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) return toast.error("Razorpay SDK failed to load");

      const rpRes = await createRazorpayOrder({ amount: total });
      const rpOrder = rpRes.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rpOrder.amount,
        currency: "INR",
        order_id: rpOrder.id,
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData,
            });
            await fetchCart();
            console.log("VERIFY RESPONSE:", verifyRes.data);
            const order = verifyRes.data.order || verifyRes.data;
            toast.success("Payment successful!");
            navigate("/order-success", { state: { order } });
          } catch (err) {
            toast.error("Payment verification failed!");
          }
        },
        prefill: { name: "", email: "" },
        theme: { color: "#4f46e5" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Order error:", err);
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Delivery Address</h3>
          {addresses.length === 0 ? (
            <p className="text-sm text-red-500">
              No address found.{" "}
              <a href="/user/profile" className="underline text-indigo-600">
                Add one in your profile →
              </a>
            </p>
          ) : (
            addresses.map((addr) => (
              <label
                key={addr._id}
                className={`block border rounded-lg p-3 mb-2 cursor-pointer transition ${
                  selectedAddressId === addr._id
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  className="mr-2"
                  checked={selectedAddressId === addr._id}
                  onChange={() => setSelectedAddressId(addr._id)}
                />
                {addr.addressLine}, {addr.city}, {addr.state} — {addr.pincode}
                {addr.isDefault && (
                  <span className="ml-2 text-xs text-green-600">(Default)</span>
                )}
              </label>
            ))
          )}
        </div>

        <div className="mb-6 bg-gray-50 rounded-lg p-4 text-sm space-y-1">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>₹{shipping}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>₹{tax}</span></div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{discount}</span></div>
          )}
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span>Total</span><span>₹{total}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Payment Method</h3>
          <label className="flex items-center gap-2 mb-2 cursor-pointer">
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="ONLINE"
              checked={paymentMethod === "ONLINE"}
              onChange={() => setPaymentMethod("ONLINE")}
            />
            Online Payment (Razorpay)
          </label>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading || !selectedAddress}
          className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition ${
            loading || !selectedAddress ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : `Place Order — ₹${total}`}
        </button>
      </div>
    </div>
  );
});

export default CheckoutPage;