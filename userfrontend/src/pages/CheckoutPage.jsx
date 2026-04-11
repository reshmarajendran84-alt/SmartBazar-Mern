import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddress } from "../context/AddressContext";
import {
  placeCODOrder,
  createRazorpayOrder,
  verifyPayment,
  placeWalletOrder,
} from "../services/orderService";
import { useCart } from "../context/CartContext";
import api from "../utils/api";

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
  const [checkingBalance, setCheckingBalance] = useState(false);
  const { fetchCart } = useCart();

  //  Fetch wallet balance on component mount
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const { data } = await api.get("/wallet");
        setWalletBalance(data.wallet?.balance || 0);
      } catch (err) {
        console.error("Failed to fetch wallet balance:", err);
        setWalletBalance(0);
      }
    };
    fetchWalletBalance();
  }, []);

  // Auto-select default address
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(def._id);
    }
  }, [addresses]);

  const selectedAddress = addresses?.find((a) => a._id === selectedAddressId) || null;

  //  Check if wallet has sufficient balance
  const hasSufficientWalletBalance = () => {
    if (paymentMethod !== "WALLET") return true;
    if (walletBalance >= total) return true;
    return false;
  };

  //  Get wallet balance warning message
  const getWalletWarning = () => {
    if (paymentMethod !== "WALLET") return null;
    if (walletBalance < total) {
      return `Insufficient wallet balance! Available: ₹${walletBalance.toFixed(2)}, Required: ₹${total.toFixed(2)}`;
    }
    return null;
  };

  const validateOrderData = () => {
    if (!cartItems.length) {
      toast.error("Cart is empty");
      return false;
    }
    
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return false;
    }
    
    //  Check wallet balance for WALLET payment
    if (paymentMethod === "WALLET" && walletBalance < total) {
      toast.error(`Insufficient wallet balance! Available: ₹${walletBalance.toFixed(2)}`);
      return false;
    }
    
    // Check required address fields
    const requiredFields = ['name', 'phone', 'addressLine', 'city', 'state', 'pincode'];
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
      subtotal: subtotal || 0,
      shipping: shipping || 0,
      tax: tax || 0,
      discount: discount || 0,
      total: total || 0,
      address: {
        fullName: selectedAddress.name || "",
        phone: selectedAddress.phone || "",
        addressLine: selectedAddress.addressLine || "",
        city: selectedAddress.city || "",
        state: selectedAddress.state || "",
        pincode: selectedAddress.pincode || "",
      },
      coupon: appliedCoupon || "",
      paymentMethod: paymentMethod,
    };
  };

  const handlePlaceOrder = async () => {
    if (!validateOrderData()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const orderData = getOrderData();
      if (!orderData) {
        toast.error("Invalid order data");
        setLoading(false);
        return;
      }
      
      console.log("ORDER DATA BEING SENT:", orderData);
      
      //  Handle WALLET payment
      if (paymentMethod === "WALLET") {
        // Double-check balance before sending
        if (walletBalance < total) {
          toast.error(`Insufficient wallet balance! Available: ₹${walletBalance.toFixed(2)}`);
          setLoading(false);
          return;
        }
        
        const res = await placeWalletOrder(orderData);
        await fetchCart();
        toast.success("Order placed successfully using wallet!");
        navigate("/order-success", { state: { order: res.data.order } });
        return;
      }
      
      // Handle COD
      if (paymentMethod === "COD") {
        const res = await placeCODOrder(orderData);
        await fetchCart();
        toast.success("Order placed successfully!");
        navigate("/order-success", { state: { order: res.data.order } });
        return;
      }

      // Handle ONLINE (Razorpay)
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
            toast.success("Payment successful!");
            navigate("/order-success", { state: { order: verifyRes.data.order } });
          } catch (err) {
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
      
      //  Better error message for wallet insufficient balance
      if (err.response?.data?.message?.includes("Insufficient wallet balance")) {
        toast.error(`Insufficient wallet balance! Please add funds or choose another payment method.`);
        // Refresh wallet balance
        const { data } = await api.get("/wallet");
        setWalletBalance(data.wallet?.balance || 0);
      } else {
        toast.error(err.response?.data?.message || "Order failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>

        {/* ✅ Wallet Balance Display */}
        {paymentMethod === "WALLET" && (
          <div className={`mb-4 p-3 rounded-lg ${walletBalance >= total ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Wallet Balance:</span>
              <span className={`text-lg font-bold ${walletBalance >= total ? 'text-green-600' : 'text-red-600'}`}>
                ₹{walletBalance.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm font-medium">Order Total:</span>
              <span className="text-lg font-bold">₹{total.toFixed(2)}</span>
            </div>
            {walletBalance < total && (
              <div className="mt-2 text-sm text-red-600">
                ⚠️ Insufficient balance. Need ₹{(total - walletBalance).toFixed(2)} more.
              </div>
            )}
            {walletBalance >= total && (
              <div className="mt-2 text-sm text-green-600">
                ✅ Sufficient balance! You can pay with wallet.
              </div>
            )}
          </div>
        )}

        {/* Address selection */}
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
                <div>
                  <p className="font-medium">{addr.name}</p>
                  <p className="text-sm text-gray-600">{addr.addressLine}</p>
                  <p className="text-sm text-gray-600">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-sm text-gray-600">Phone: {addr.phone}</p>
                </div>
                {addr.isDefault && (
                  <span className="ml-2 text-xs text-green-600">(Default)</span>
                )}
              </label>
            ))
          )}
        </div>

        {/* Order summary */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 text-sm space-y-1">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{shipping}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{tax}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* Payment method */}
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
          
          <label className="flex items-center gap-2 mb-2 cursor-pointer">
            <input
              type="radio"
              value="ONLINE"
              checked={paymentMethod === "ONLINE"}
              onChange={() => setPaymentMethod("ONLINE")}
            />
            Online Payment (Razorpay)
          </label>
          
          {/* ✅ Wallet payment option with balance check */}
          <label className={`flex items-center gap-2 cursor-pointer ${walletBalance < total ? 'opacity-50' : ''}`}>
            <input
              type="radio"
              value="WALLET"
              checked={paymentMethod === "WALLET"}
              onChange={() => setPaymentMethod("WALLET")}
              disabled={walletBalance < total}
            />
            <span>Pay with Wallet</span>
            <span className="text-sm text-gray-500">(₹{walletBalance.toFixed(2)} available)</span>
          </label>
          
          {walletBalance < total && (
            <p className="text-xs text-red-500 mt-1">
              ⚠️ Need ₹{(total - walletBalance).toFixed(2)} more to use wallet
            </p>
          )}
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading || !selectedAddress || !addresses?.length || (paymentMethod === "WALLET" && walletBalance < total)}
          className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition ${
            loading || !selectedAddress || !addresses?.length || (paymentMethod === "WALLET" && walletBalance < total)
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {loading 
            ? "Processing..." 
            : paymentMethod === "WALLET" 
              ? `Pay with Wallet — ₹${total}` 
              : `Place Order — ₹${total}`}
        </button>
      </div>
    </div>
  );
});

export default CheckoutPage;