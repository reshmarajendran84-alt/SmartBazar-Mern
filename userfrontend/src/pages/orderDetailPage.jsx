// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../utils/api";

// const statusSteps = ["Pending", "Confirmed", "Shipped", "Delivered"];

// const OrderDetailPage = () => {
//   const { orderId } = useParams();
//   // useParams reads the :orderId from the URL
//   // e.g. URL is /orders/abc123 → orderId = "abc123"

//   const navigate = useNavigate();
//   const [order, setOrder]     = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState("");

//   useEffect(() => {
//     api.get(`/order/${orderId}`)
//       .then(res => setOrder(res.data.order))
//       .catch(err => setError(err.response?.data?.message || "Order not found"))
//       .finally(() => setLoading(false));
//   }, [orderId]);

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <p className="text-gray-500 animate-pulse">Loading order...</p>
//     </div>
//   );

//   if (error) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <p className="text-red-500">{error}</p>
//     </div>
//   );

//   if (!order) return null;

//   const currentStep = statusSteps.indexOf(order.status);
//   const isCancelledOrReturned = ["Cancelled", "Returned", "Failed"].includes(order.status);

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto">

//         {/* Back button */}
//         <button
//           onClick={() => navigate("/my-orders")}
//           className="text-sm text-indigo-600 hover:underline mb-6 flex items-center gap-1"
//         >
//           ← Back to My Orders
//         </button>

//         {/* Order ID + Date */}
//         <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
//           <p className="text-xs text-gray-400 font-mono">
//             Order #{order._id?.slice(-8).toUpperCase()}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">
//             Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
//               day: "numeric", month: "long", year: "numeric"
//             })}
//           </p>
//           <p className="text-xl font-bold mt-2">₹{order.total}</p>
//         </div>

//         {/* Status Timeline */}
//         <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
//           <h2 className="font-semibold text-gray-700 mb-4">Order Status</h2>

//           {!isCancelledOrReturned ? (
//             <div className="flex items-center justify-between relative">
//               <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
//               <div
//                 className="absolute top-4 left-0 h-0.5 bg-indigo-500 z-0 transition-all duration-500"
//                 style={{ width: `${Math.max(0, (currentStep / (statusSteps.length - 1)) * 100)}%` }}
//               />
//               {statusSteps.map((step, idx) => (
//                 <div key={step} className="flex flex-col items-center z-10 gap-1 w-16">
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2
//                     ${idx <= currentStep
//                       ? "bg-indigo-600 border-indigo-600 text-white"
//                       : "bg-white border-gray-300 text-gray-400"}`}>
//                     {idx < currentStep ? "✓" : idx + 1}
//                   </div>
//                   <span className={`text-xs font-medium text-center
//                     ${idx <= currentStep ? "text-indigo-600" : "text-gray-400"}`}>
//                     {step}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="bg-red-50 rounded-lg p-3 text-center">
//               <p className="text-sm text-red-500 font-medium">
//                 {order.status === "Cancelled" ? "This order was cancelled"
//                   : order.status === "Returned" ? "Return requested — refund credited to wallet"
//                   : "This order failed"}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Items Purchased */}
//         <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
//           <h2 className="font-semibold text-gray-700 mb-3">Items Purchased</h2>
//           <div className="space-y-3">
//             {order.cartItems?.map((item, idx) => (
//               <div key={idx} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
//                 <div>
//                   <p className="font-medium text-gray-800">{item.name}</p>
//                   <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
//                 </div>
//                 <span className="font-semibold">₹{item.price * item.quantity}</span>
//               </div>
//             ))}
//           </div>

//           {/* Price breakdown */}
//           <div className="mt-4 border-t pt-3 space-y-1 text-sm text-gray-500">
//             <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
//             <div className="flex justify-between"><span>Shipping</span><span>₹{order.shipping}</span></div>
//             <div className="flex justify-between"><span>Tax</span><span>₹{order.tax}</span></div>
//             {order.discount > 0 && (
//               <div className="flex justify-between text-green-600">
//                 <span>Discount</span><span>-₹{order.discount}</span>
//               </div>
//             )}
//             <div className="flex justify-between font-bold text-black border-t pt-2">
//               <span>Total</span><span>₹{order.total}</span>
//             </div>
//           </div>
//         </div>

//         {/* Payment Method */}
//         <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
//           <h2 className="font-semibold text-gray-700 mb-3">Payment</h2>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-500">Method</span>
//             <span className="font-medium">
//               {order.paymentMethod === "COD" ? "Cash on Delivery"
//                 : order.paymentMethod === "WALLET" ? "Wallet"
//                 : "Online (Razorpay)"}
//             </span>
//           </div>
//           <div className="flex justify-between text-sm mt-2">
//             <span className="text-gray-500">Status</span>
//             <span className={`font-medium px-2 py-0.5 rounded-full text-xs
//               ${order.status === "Delivered" || order.status === "Confirmed"
//                 ? "bg-green-100 text-green-700"
//                 : order.status === "Cancelled" || order.status === "Failed"
//                 ? "bg-red-100 text-red-600"
//                 : "bg-yellow-100 text-yellow-700"}`}>
//               {order.status}
//             </span>
//           </div>
//         </div>

//         {/* Delivery Address */}
//         <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
//           <h2 className="font-semibold text-gray-700 mb-3">Delivery Address</h2>
//           {order.address ? (
//             <div className="text-sm text-gray-600 space-y-1">
//               <p className="font-medium text-gray-800">{order.address.fullName}</p>
//               <p>{order.address.addressLine}</p>
//               <p>{order.address.city}, {order.address.state} — {order.address.pincode}</p>
//               {order.address.phone && (
//                 <p className="text-gray-400 text-xs">Phone: {order.address.phone}</p>
//               )}
//             </div>
//           ) : (
//             <p className="text-sm text-gray-400">No address on file</p>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default OrderDetailPage;


import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

const statusSteps = ["Pending", "Confirmed", "Shipped", "Delivered"];

const OrderDetailPage = () => {
  const { orderId } = useParams();
  /*
    useParams() reads the dynamic segment from the URL.
    If the URL is /orders/abc123def456  →  orderId = "abc123def456"
    This is the full MongoDB _id of the order.
  */

  const navigate              = useNavigate();
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    /*
      Every time orderId changes (user navigates to a different order),
      this effect runs again and fetches fresh data.
    */
    if (!orderId) return;

    setLoading(true);
    setError("");

    api.get(`/order/${orderId}`)
      .then(res => {
        /*
          Your backend sends:  { success: true, order: {...} }
          So we read res.data.order — not res.data directly
        */
        setOrder(res.data.order);
      })
      .catch(err => {
        const msg = err?.response?.data?.message || "Could not load order";
        setError(msg);
      })
      .finally(() => setLoading(false));

  }, [orderId]);

  // ── Loading state ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 animate-pulse text-lg">Loading order...</p>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={() => navigate("/my-orders")}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to My Orders
        </button>
      </div>
    );
  }

  // ── No order guard ────────────────────────────────────────────────────
  if (!order) return null;

  // ── Derived values ────────────────────────────────────────────────────
  const currentStep           = statusSteps.indexOf(order.status);
  const isCancelledOrReturned = ["Cancelled", "Returned", "Failed"].includes(order.status);

  const getPaymentLabel = () => {
    switch (order.paymentMethod) {
      case "COD":    return "Cash on Delivery";
      case "WALLET": return "Wallet";
      case "ONLINE": return "Online (Razorpay)";
      default:       return order.paymentMethod;
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

  // ── Full page render ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">

        {/* Back navigation */}
        <button
          onClick={() => navigate("/my-orders")}
          className="text-sm text-indigo-600 hover:underline mb-6 inline-flex items-center gap-1"
        >
          ← Back to My Orders
        </button>

        {/* ── Section 1: Order ID + Date + Total ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-400 font-mono">
                Order #{order._id?.slice(-8).toUpperCase()}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadgeClass()}`}>
              {order.status}
            </span>
          </div>
          <p className="text-2xl font-bold mt-3">₹{order.total}</p>
        </div>

        {/* ── Section 2: Status Timeline ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <h2 className="font-semibold text-gray-700 mb-5">Order Status</h2>

          {!isCancelledOrReturned ? (
            <div className="flex items-center justify-between relative">
              {/* Grey background track */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
              {/* Filled progress track */}
              <div
                className="absolute top-4 left-0 h-0.5 bg-indigo-500 z-0 transition-all duration-500"
                style={{
                  width: `${Math.max(0, (currentStep / (statusSteps.length - 1)) * 100)}%`,
                }}
              />
              {statusSteps.map((step, idx) => (
                <div key={step} className="flex flex-col items-center z-10 gap-1 w-16">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center
                      text-xs font-bold border-2
                      ${idx <= currentStep
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white border-gray-300 text-gray-400"}`}
                  >
                    {idx < currentStep ? "✓" : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-medium text-center
                      ${idx === currentStep
                        ? "text-indigo-700 font-bold"
                        : idx < currentStep
                        ? "text-indigo-500"
                        : "text-gray-400"}`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-sm text-red-500 font-medium">
                {order.status === "Cancelled" && "This order was cancelled"}
                {order.status === "Returned"  && "Return requested — refund credited to wallet"}
                {order.status === "Failed"    && "This order failed"}
              </p>
              {(order.paymentMethod === "ONLINE" || order.paymentMethod === "WALLET") && (
                <p className="text-xs text-red-400 mt-1">
                  Refund of ₹{order.total} has been credited to your wallet
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── Section 3: Items Purchased ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <h2 className="font-semibold text-gray-700 mb-4">Items Purchased</h2>

          <div className="space-y-3">
            {order.cartItems?.length > 0 ? (
              order.cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm
                    border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    {/* Product image if available */}
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-gray-400 text-xs">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-700">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No items found</p>
            )}
          </div>

          {/* Price breakdown */}
          <div className="mt-4 border-t pt-3 space-y-1.5 text-sm text-gray-500">
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
            <div className="flex justify-between font-bold text-black text-base border-t pt-2 mt-1">
              <span>Total</span><span>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* ── Section 4: Payment Method ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <h2 className="font-semibold text-gray-700 mb-3">Payment</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="font-medium">{getPaymentLabel()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment status</span>
              <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${getStatusBadgeClass()}`}>
                {order.status}
              </span>
            </div>
            {order.razorpayPaymentId && (
              <div className="flex justify-between">
                <span className="text-gray-500">Payment ID</span>
                <span className="font-mono text-xs text-gray-400">
                  {order.razorpayPaymentId}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Section 5: Delivery Address ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-3">Delivery Address</h2>
          {order.address ? (
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-800 text-base">
                {order.address.fullName}
              </p>
              <p>{order.address.addressLine}</p>
              <p>
                {order.address.city}, {order.address.state} — {order.address.pincode}
              </p>
              {order.address.phone && (
                <p className="text-gray-400 text-xs pt-1">
                  Phone: {order.address.phone}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No address on file</p>
          )}
        </div>

        {/* ── Bottom action buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 border border-indigo-600 text-indigo-600
              py-3 rounded-xl font-semibold hover:bg-indigo-50 transition text-sm"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/my-orders")}
            className="flex-1 bg-indigo-600 text-white
              py-3 rounded-xl font-semibold hover:bg-indigo-700 transition text-sm"
          >
            My Orders
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailPage;