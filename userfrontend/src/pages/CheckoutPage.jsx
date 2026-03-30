// // import React, { useState, useEffect } from "react";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import { toast } from "react-toastify";
// // import { useAddress } from "../context/AddressContext";
// // import {
// //   placeCODOrder,
// //   createRazorpayOrder,
// //   verifyPayment,
// // } from "../services/orderService";
// // import { useCart } from "../context/CartContext";

// // const loadRazorpayScript = () =>
// //   new Promise((resolve) => {
// //     if (window.Razorpay) return resolve(true);
// //     const script = document.createElement("script");
// //     script.src = "https://checkout.razorpay.com/v1/checkout.js";
// //     script.onload = () => resolve(true);
// //     script.onerror = () => resolve(false);
// //     document.body.appendChild(script);
// //   });

// // const CheckoutPage = React.memo(() => {
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   const {
// //     cartItems = [],
// //     subtotal = 0,
// //     shipping = 0,
// //     tax = 0,
// //     discount = 0,
// //     total = 0,
// //     appliedCoupon = null,
// //   } = location.state || {};

// //   const { addresses } = useAddress();
// //   const [selectedAddressId, setSelectedAddressId] = useState(null);
// //   const [paymentMethod, setPaymentMethod] = useState("COD");
// //   const [loading, setLoading] = useState(false);
// //   const { fetchCart } = useCart();

// //   // Auto-select default address
// //   useEffect(() => {
// //     if (addresses && addresses.length > 0) {
// //       console.log("=== ADDRESS FIELDS ===");
// //       console.log("First address object:", addresses[0]);
// //       console.log("Available fields:", Object.keys(addresses[0]));
// //       console.log("Address name:", addresses[0].name);
      
// //       const def = addresses.find((a) => a.isDefault) || addresses[0];
// //       setSelectedAddressId(def._id);
// //     }
// //   }, [addresses]);

// //   // Safely get selected address with null check
// //   const selectedAddress = addresses?.find((a) => a._id === selectedAddressId) || null;

// //   // Validation before creating orderData
// //   const validateOrderData = () => {
// //     if (!cartItems.length) {
// //       toast.error("Cart is empty");
// //       return false;
// //     }
    
// //     if (!selectedAddress) {
// //       toast.error("Please select a delivery address");
// //       return false;
// //     }
    
// //     // Check required address fields (based on your schema)
// //     const requiredFields = ['name', 'phone', 'addressLine', 'city', 'state', 'pincode'];
// //     for (const field of requiredFields) {
// //       if (!selectedAddress[field]) {
// //         toast.error(`Address missing: ${field}`);
// //         console.log(`Missing field ${field} in address:`, selectedAddress);
// //         return false;
// //       }
// //     }
    
// //     return true;
// //   };

// //   // Safely create orderData only when selectedAddress exists
// //   const getOrderData = () => {
// //     if (!selectedAddress) return null;
    
// //     console.log("Selected address:", selectedAddress);
    
// //     return {
// //       cartItems: cartItems.map((item) => ({
// //         productId: item.productId?._id || item.productId,
// //         name: item.productId?.name || item.name,
// //         quantity: item.quantity,
// //         price: item.price,
// //       })),
// //       subtotal: subtotal || 0,
// //       shipping: shipping || 0,
// //       tax: tax || 0,
// //       discount: discount || 0,
// //       total: total || 0,
// //       address: {
// //         fullName: selectedAddress.name || "",  // Map 'name' to 'fullName' for order schema
// //         phone: selectedAddress.phone || "",
// //         addressLine: selectedAddress.addressLine || "",
// //         city: selectedAddress.city || "",
// //         state: selectedAddress.state || "",
// //         pincode: selectedAddress.pincode || "",
// //       },
// //       coupon: appliedCoupon || "",
// //       paymentMethod: paymentMethod,
// //     };
// //   };

// //   const handlePlaceOrder = async () => {
// //     // Validate before proceeding
// //     if (!validateOrderData()) {
// //       return;
// //     }
    
// //     setLoading(true);
    
// //     try {
// //       const orderData = getOrderData();
// //       if (!orderData) {
// //         toast.error("Invalid order data");
// //         setLoading(false);
// //         return;
// //       }
      
// //       console.log("ORDER DATA BEING SENT:", orderData);
      
// //       if (paymentMethod === "COD") {
// //         const res = await placeCODOrder(orderData);
// //         await fetchCart();
// //         console.log("selectedAddress:", selectedAddress);
// // console.log("orderData.address:", orderData.address);
// //         console.log("COD RESPONSE:", res.data);
// //         toast.success("Order placed successfully!");
// //         navigate("/order-success", { state: { order: res.data.order } });
// //         return;
// //       }

// //       // Online Payment
// //       const isLoaded = await loadRazorpayScript();
// //       if (!isLoaded) {
// //         toast.error("Razorpay SDK failed to load");
// //         setLoading(false);
// //         return;
// //       }

// //       const rpRes = await createRazorpayOrder({ amount: total });
// //       const rpOrder = rpRes.data.order;

// //       const options = {
// //         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
// //         amount: rpOrder.amount,
// //         currency: "INR",
// //         order_id: rpOrder.id,
// //         handler: async (response) => {
// //           try {
// //             const verifyRes = await verifyPayment({
// //               razorpay_order_id: response.razorpay_order_id,
// //               razorpay_payment_id: response.razorpay_payment_id,
// //               razorpay_signature: response.razorpay_signature,
// //               orderData,
// //             });
// //             await fetchCart();
// //             console.log("VERIFY RESPONSE:", verifyRes.data);
// //             toast.success("Payment successful!");
// //             navigate("/order-success", { state: { order: verifyRes.data.order } });
// //           } catch (err) {
// //             toast.error("Payment verification failed!");
// //           }
// //         },
// //         prefill: {
// //           name: selectedAddress?.name || "",
// //           contact: selectedAddress?.phone || "",
// //         },
// //         theme: { color: "#4f46e5" },
// //       };

// // new window.Razorpay(options).open(); // opens payment popup
      
// //     } catch (err) {
// //       console.error("Order error:", err);
// //       toast.error(err.response?.data?.message || "Order failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 py-10 px-4">
// //       <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6">
// //         <h2 className="text-2xl font-bold mb-6">Checkout</h2>

// //         {/* Address selection */}
// //         <div className="mb-6">
// //           <h3 className="font-semibold mb-3">Delivery Address</h3>
// //           {!addresses || addresses.length === 0 ? (
// //             <p className="text-sm text-red-500">
// //               No address found.{" "}
// //               <a href="/user/profile" className="underline text-indigo-600">
// //                 Add one in your profile →
// //               </a>
// //             </p>
// //           ) : (
// //             addresses.map((addr) => (
// //               <label
// //                 key={addr._id}
// //                 className={`block border rounded-lg p-3 mb-2 cursor-pointer transition ${
// //                   selectedAddressId === addr._id
// //                     ? "border-indigo-600 bg-indigo-50"
// //                     : "border-gray-200"
// //                 }`}
// //               >
// //                 <input
// //                   type="radio"
// //                   name="address"
// //                   className="mr-2"
// //                   checked={selectedAddressId === addr._id}
// //                   onChange={() => setSelectedAddressId(addr._id)}
// //                 />
// //                 <div>
// //                   <p className="font-medium">{addr.name}</p>
// //                   <p className="text-sm text-gray-600">{addr.addressLine}</p>
// //                   <p className="text-sm text-gray-600">
// //                     {addr.city}, {addr.state} - {addr.pincode}
// //                   </p>
// //                   <p className="text-sm text-gray-600">Phone: {addr.phone}</p>
// //                 </div>
// //                 {addr.isDefault && (
// //                   <span className="ml-2 text-xs text-green-600">(Default)</span>
// //                 )}
// //               </label>
// //             ))
// //           )}
// //         </div>

// //         {/* Order summary */}
// //         <div className="mb-6 bg-gray-50 rounded-lg p-4 text-sm space-y-1">
// //           <h3 className="font-semibold mb-2">Order Summary</h3>
// //           <div className="flex justify-between">
// //             <span>Subtotal</span>
// //             <span>₹{subtotal}</span>
// //           </div>
// //           <div className="flex justify-between">
// //             <span>Shipping</span>
// //             <span>₹{shipping}</span>
// //           </div>
// //           <div className="flex justify-between">
// //             <span>Tax</span>
// //             <span>₹{tax}</span>
// //           </div>
// //           {discount > 0 && (
// //             <div className="flex justify-between text-green-600">
// //               <span>Discount</span>
// //               <span>-₹{discount}</span>
// //             </div>
// //           )}
// //           <div className="flex justify-between font-bold border-t pt-2 mt-2">
// //             <span>Total</span>
// //             <span>₹{total}</span>
// //           </div>
// //         </div>

// //         {/* Payment method */}
// //         <div className="mb-6">
// //           <h3 className="font-semibold mb-3">Payment Method</h3>
// //           <label className="flex items-center gap-2 mb-2 cursor-pointer">
// //             <input
// //               type="radio"
// //               value="COD"
// //               checked={paymentMethod === "COD"}
// //               onChange={() => setPaymentMethod("COD")}
// //             />
// //             Cash on Delivery
// //           </label>
// //           <label className="flex items-center gap-2 cursor-pointer">
// //             <input
// //               type="radio"
// //               value="ONLINE"
// //               checked={paymentMethod === "ONLINE"}
// //               onChange={() => setPaymentMethod("ONLINE")}
// //             />
// //             Online Payment (Razorpay)
// //           </label>
// //         </div>

// //         <button
// //           onClick={handlePlaceOrder}
// //           disabled={loading || !selectedAddress || !addresses?.length}
// //           className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition ${
// //             loading || !selectedAddress || !addresses?.length
// //               ? "opacity-50 cursor-not-allowed"
// //               : ""
// //           }`}
// //         >
// //           {loading ? "Processing..." : `Place Order — ₹${total}`}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // });

// // export default CheckoutPage;


// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useAddress } from "../context/AddressContext";
// import { useCart } from "../context/CartContext";
// import {
//   placeCODOrder,
//   createRazorpayOrder,
//   verifyPayment,
// } from "../services/orderService";
// import { placeWalletOrder } from "../services/orderService";
// import {getWallet } from "../services/walletService"
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
//   const { cartItems = [], subtotal = 0, shipping = 0, tax = 0, discount = 0, total = 0, appliedCoupon = null } =
//     location.state || {};
//   const { addresses } = useAddress();
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const [loading, setLoading] = useState(false);
//   const { fetchCart } = useCart();
// const [walletBalance, setWalletBalance] = useState(0);

//   // Auto-select default address
//   useEffect(() => {
//     if (addresses && addresses.length > 0) {
//       const def = addresses.find((a) => a.isDefault) || addresses[0];
//       setSelectedAddressId(def._id);
//     }
//   }, [addresses]);
// useEffect(() => {
//   const fetchBalance = async () => {
//     try {
//       const res = await getWallet();
//       setWalletBalance(res.data.wallet?.balance || 0);
//     } catch {
//       setWalletBalance(0);
//     }
//   };
//   fetchBalance();
// }, []);
//   const selectedAddress = addresses?.find((a) => a._id === selectedAddressId) || null;

//   const validateOrderData = () => {
//     if (!cartItems.length) {
//       toast.error("Cart is empty");
//       return false;
//     }
//     if (!selectedAddress) {
//       toast.error("Please select a delivery address");
//       return false;
//     }
//     const requiredFields = ["name", "phone", "addressLine", "city", "state", "pincode"];
//     for (const field of requiredFields) {
//       if (!selectedAddress[field]) {
//         toast.error(`Address missing: ${field}`);
//         return false;
//       }
//     }
//     return true;
//   };

//   const getOrderData = () => {
//     if (!selectedAddress) return null;
//     return {
//       cartItems: cartItems.map((item) => ({
//         productId: item.productId?._id || item.productId,
//         name: item.productId?.name || item.name,
//         quantity: item.quantity,
//         price: item.price,
//       })),
//       subtotal,
//       shipping,
//       tax,
//       discount,
//       total,
//       address: {
//         fullName: selectedAddress.name,
//         phone: selectedAddress.phone,
//         addressLine: selectedAddress.addressLine,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         pincode: selectedAddress.pincode,
//       },
//       coupon: appliedCoupon || "",
//       paymentMethod,
//     };
//   };

//   const handlePlaceOrder = async () => {
//     if (!validateOrderData()) return;
//     setLoading(true);
//     try {
//       const orderData = getOrderData();
//       if (!orderData) {
//         toast.error("Invalid order data");
//         setLoading(false);
//         return;
//       }

//       // ─── COD ───
//       if (paymentMethod === "COD") {
//         const res = await placeCODOrder(orderData);
//         await fetchCart();
//         toast.success("Order placed successfully!");
//         navigate("/order-success", { state: { order: res.data.order } });
//         return;
//       }

//       // ─── Online Payment ───
//       const isLoaded = await loadRazorpayScript();
//       if (!isLoaded) {
//         toast.error("Razorpay SDK failed to load");
//         setLoading(false);
//         return;
//       }
// //wallet payment
// if (paymentMethod === "WALLET") {
//   if (walletBalance < total) {
//     toast.error(`Insufficient wallet balance. Available: ₹${walletBalance}`);
//     setLoading(false);
//     return;
//   }
//   const res = await placeWalletOrder(orderData);
//   await fetchCart();
//   toast.success("Order placed using wallet!");
//   navigate("/order-success", { state: { order: res.data.order } });
//   return;
// }
//       const rpRes = await createRazorpayOrder({ amount: total });
//       const rpOrder = rpRes.data.order;

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: rpOrder.amount,
//         currency: "INR",
//         order_id: rpOrder.id,
//         handler: async (response) => {
//           try {
//             const verifyRes = await verifyPayment({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               orderData,
//             });
//             await fetchCart();
//             toast.success("Payment successful!");
//             navigate("/order-success", { state: { order: verifyRes.data.order } });
//           } catch {
//             toast.error("Payment verification failed!");
//           }
//         },
//         prefill: {
//           name: selectedAddress?.name || "",
//           contact: selectedAddress?.phone || "",
//         },
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
//       <div className="max-w-lg w-full sm:max-w-xl md:max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
//         <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">Checkout</h2>

//         {/* Address selection */}
//         <div className="mb-6">
//           <h3 className="font-semibold mb-3">Delivery Address</h3>
//           {!addresses || addresses.length === 0 ? (
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
//                 className={`block border rounded-lg p-3 mb-2 cursor-pointer transition focus-within:ring-2 focus-within:ring-indigo-500 ${
//                   selectedAddressId === addr._id
//                     ? "border-indigo-600 bg-indigo-50"
//                     : "border-gray-200"
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name="address"
//                   className="sr-only"
//                   checked={selectedAddressId === addr._id}
//                   onChange={() => setSelectedAddressId(addr._id)}
//                 />
//                 <div>
//                   <p className="font-medium">{addr.name}</p>
//                   <p className="text-sm text-gray-600">{addr.addressLine}</p>
//                   <p className="text-sm text-gray-600">
//                     {addr.city}, {addr.state} - {addr.pincode}
//                   </p>
//                   <p className="text-sm text-gray-600">Phone: {addr.phone}</p>
//                   {addr.isDefault && (
//                     <span className="ml-2 text-xs text-green-600">(Default)</span>
//                   )}
//                 </div>
//               </label>
//             ))
//           )}
//         </div>

//         {/* Order summary */}
//         <div className="mb-6 bg-gray-50 rounded-lg p-4 text-sm space-y-1">
//           <h3 className="font-semibold mb-2">Order Summary</h3>
//           {[
//             ["Subtotal", subtotal],
//             ["Shipping", shipping],
//             ["Tax", tax],
//             ...(discount > 0 ? [["Discount", `-${discount}`]] : []),
//           ].map(([label, value]) => (
//             <div className="flex justify-between sm:justify-between flex-col sm:flex-row" key={label}>
//               <span>{label}</span>
//               <span className={label === "Discount" ? "text-green-600" : ""}>₹{value}</span>
//             </div>
//           ))}
//           <div className="flex justify-between font-bold border-t pt-2 mt-2">
//             <span>Total</span>
//             <span>₹{total}</span>
//           </div>
//         </div>

//         {/* Payment method */}
//       {["COD", "ONLINE", "WALLET"].map((method) => (
//   <label
//     key={method}
//     className={`flex items-center gap-3 p-3 mb-2 border rounded-lg cursor-pointer hover:bg-indigo-50 transition ${
//       paymentMethod === method
//         ? "border-indigo-600 bg-indigo-50"
//         : "border-gray-200"
//     }`}
//   >
//     <input
//       type="radio"
//       value={method}
//       checked={paymentMethod === method}
//       onChange={() => setPaymentMethod(method)}
//       className="sr-only"
//     />
//     <span className={`w-5 h-5 border rounded-full flex-shrink-0 flex items-center justify-center ${
//       paymentMethod === method ? "bg-indigo-600" : "bg-white"
//     }`} />

//     <div className="flex justify-between w-full items-center">
//       <span>
//         {method === "COD"    && "Cash on Delivery"}
//         {method === "ONLINE" && "Online Payment (Razorpay)"}
//         {method === "WALLET" && "Pay from Wallet"}
//       </span>

//       {/* ✅ Show balance only for wallet option */}
//       {method === "WALLET" && (
//         <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
//           walletBalance >= total
//             ? "bg-green-100 text-green-700"
//             : "bg-red-100 text-red-500"
//         }`}>
//           ₹{walletBalance.toFixed(2)} available
//         </span>
//       )}
//     </div>
//   </label>
// ))}

//         {/* Place Order button */}
//         <button
//           onClick={handlePlaceOrder}
//           disabled={loading || !selectedAddress || !addresses?.length}
//           className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition ${
//             loading || !selectedAddress || !addresses?.length
//               ? "opacity-50 cursor-not-allowed"
//               : ""
//           }`}
//         >
//           {loading ? "Processing..." : `Place Order — ₹${total}`}
//         </button>

//         {/* Sticky mobile button */}
//         <div className="fixed bottom-0 left-0 w-full p-4 bg-white shadow-lg sm:hidden">
//           <button
//             onClick={handlePlaceOrder}
//             disabled={loading || !selectedAddress || !addresses?.length}
//             className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition ${
//               loading || !selectedAddress || !addresses?.length
//                 ? "opacity-50 cursor-not-allowed"
//                 : ""
//             }`}
//           >
//             {loading ? "Processing..." : `Place Order — ₹${total}`}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default CheckoutPage;


import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddress } from "../context/AddressContext";
import { useCart } from "../context/CartContext";
import {
  placeCODOrder,
  createRazorpayOrder,
  verifyPayment,
  placeWalletOrder,
} from "../services/orderService";
import { getWallet } from "../services/walletService";

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
  const [walletBalance, setWalletBalance] = useState(0);
  const { fetchCart } = useCart();

  // Auto-select default address
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(def._id);
    }
  }, [addresses]);

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await getWallet();
        setWalletBalance(res.data.wallet?.balance || 0);
      } catch {
        setWalletBalance(0);
      }
    };
    fetchBalance();
  }, []);

  const selectedAddress =
    addresses?.find((a) => a._id === selectedAddressId) || null;

  const validateOrderData = () => {
    if (!cartItems.length) {
      toast.error("Cart is empty");
      return false;
    }
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return false;
    }
    const requiredFields = ["name", "phone", "addressLine", "city", "state", "pincode"];
    for (const field of requiredFields) {
      if (!selectedAddress[field]) {
        toast.error(`Address missing: ${field}`);
        return false;
      }
    }
    return true;
  };

  const getOrderData = () => {
    if (!selectedAddress) return null;
    return {
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
      address: {
        fullName: selectedAddress.name,
        phone: selectedAddress.phone,
        addressLine: selectedAddress.addressLine,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
      },
      coupon: appliedCoupon || "",
      paymentMethod,
    };
  };

  const handlePlaceOrder = async () => {
    if (!validateOrderData()) return;
    setLoading(true);

    try {
      const orderData = getOrderData();
      if (!orderData) {
        toast.error("Invalid order data");
        setLoading(false);
        return;
      }

      // ─── COD ─────────────────────────────────────────────────────────────
      if (paymentMethod === "COD") {
        const res = await placeCODOrder(orderData);
        await fetchCart();
        toast.success("Order placed successfully!");
        navigate("/order-success", { state: { order: res.data.order } });
        return;
      }

      // ─── WALLET ──────────────────────────────────────────────────────────
      // ✅ FIX: Wallet is its own branch, before Razorpay script loads
      if (paymentMethod === "WALLET") {
        if (walletBalance < total) {
          toast.error(`Insufficient wallet balance. Available: ₹${walletBalance.toFixed(2)}`);
          setLoading(false);
          return;
        }
        const res = await placeWalletOrder(orderData);
        await fetchCart();
        toast.success("Order placed using wallet! 🎉");
        navigate("/order-success", { state: { order: res.data.order } });
        return;
      }

      // ─── ONLINE (Razorpay) ───────────────────────────────────────────────
      // Only reaches here if paymentMethod === "ONLINE"
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load");
        setLoading(false);
        return;
      }

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
            toast.success("Payment successful! 🎉");
            navigate("/order-success", {
              state: { order: verifyRes.data.order },
            });
          } catch {
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: selectedAddress?.name || "",
          contact: selectedAddress?.phone || "",
        },
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
      <div className="max-w-lg w-full sm:max-w-xl md:max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">
          Checkout
        </h2>

        {/* ── Delivery Address ────────────────────────────────────────────── */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Delivery Address</h3>
          {!addresses || addresses.length === 0 ? (
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
                className={`block border rounded-lg p-3 mb-2 cursor-pointer transition focus-within:ring-2 focus-within:ring-indigo-500 ${
                  selectedAddressId === addr._id
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  className="sr-only"
                  checked={selectedAddressId === addr._id}
                  onChange={() => setSelectedAddressId(addr._id)}
                />
                <div>
                  <p className="font-medium">{addr.name}</p>
                  <p className="text-sm text-gray-600">{addr.addressLine}</p>
                  <p className="text-sm text-gray-600">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-sm text-gray-600">Phone: {addr.phone}</p>
                  {addr.isDefault && (
                    <span className="text-xs text-green-600">(Default)</span>
                  )}
                </div>
              </label>
            ))
          )}
        </div>

        {/* ── Order Summary ───────────────────────────────────────────────── */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 text-sm space-y-1">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          {[
            ["Subtotal", subtotal],
            ["Shipping", shipping],
            ["Tax", tax],
            ...(discount > 0 ? [["Discount", `-${discount}`]] : []),
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between flex-col sm:flex-row"
            >
              <span>{label}</span>
              <span className={label === "Discount" ? "text-green-600" : ""}>
                ₹{value}
              </span>
            </div>
          ))}
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* ── Payment Method ──────────────────────────────────────────────── */}
        {/* ✅ FIX: Added wrapper div with heading */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Payment Method</h3>
          {["COD", "ONLINE", "WALLET"].map((method) => (
            <label
              key={method}
              className={`flex items-center gap-3 p-3 mb-2 border rounded-lg cursor-pointer hover:bg-indigo-50 transition ${
                paymentMethod === method
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
                className="sr-only"
              />

              {/* Custom radio dot */}
              <span
                className={`w-5 h-5 border-2 rounded-full flex-shrink-0 flex items-center justify-center transition ${
                  paymentMethod === method
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-gray-300 bg-white"
                }`}
              >
                {paymentMethod === method && (
                  <span className="w-2 h-2 bg-white rounded-full" />
                )}
              </span>

              <div className="flex justify-between w-full items-center">
                <span className="text-sm font-medium">
                  {method === "COD" && "Cash on Delivery"}
                  {method === "ONLINE" && "Online Payment (Razorpay)"}
                  {method === "WALLET" && "Pay from Wallet"}
                </span>

                {/* Wallet balance badge */}
                {method === "WALLET" && (
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      walletBalance >= total
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    ₹{walletBalance.toFixed(2)} available
                  </span>
                )}
              </div>
            </label>
          ))}
        </div>

        {/* ── Place Order Button (desktop) ────────────────────────────────── */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading || !selectedAddress || !addresses?.length}
          className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition ${
            loading || !selectedAddress || !addresses?.length
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {loading ? "Processing..." : `Place Order — ₹${total}`}
        </button>

        {/* ── Sticky Mobile Button ────────────────────────────────────────── */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white shadow-lg sm:hidden z-50">
          <button
            onClick={handlePlaceOrder}
            disabled={loading || !selectedAddress || !addresses?.length}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition ${
              loading || !selectedAddress || !addresses?.length
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {loading ? "Processing..." : `Place Order — ₹${total}`}
          </button>
        </div>
      </div>
    </div>
  );
});

export default CheckoutPage;