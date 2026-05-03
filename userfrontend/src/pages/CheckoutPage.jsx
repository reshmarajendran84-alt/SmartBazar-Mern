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

const CheckoutPage = () => {
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

  const { addresses = [], addAddress, refreshAddresses } = useAddress();
  const { fetchCart } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [saveNewAddress, setSaveNewAddress] = useState(true);

  const [inlineAddress, setInlineAddress] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (key) => (e) => {
    setInlineAddress((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  // Wallet
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { data } = await api.get("/wallet");
        setWalletBalance(data.wallet?.balance || 0);
      } catch {
        setWalletBalance(0);
      }
    };
    fetchWallet();
  }, []);

  // Auto select address
  useEffect(() => {
    if (addresses.length > 0) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(def._id);
    }
  }, [addresses]);

  const selectedAddress =
    addresses.find((a) => a._id === selectedAddressId) || null;

  // Function to save inline address to user's profile
  const saveAddressToProfile = async () => {
  if (!saveNewAddress) return null;

  const { name, phone, addressLine, city, state, pincode } = inlineAddress;
  if (!name || !phone || !addressLine || !city || !state || !pincode) return null;

  const addressExists = addresses.some(
    (addr) =>
      addr.name === name &&
      addr.phone === phone &&
      addr.addressLine === addressLine &&
      addr.city === city &&
      addr.state === state &&
      addr.pincode === pincode
  );

  if (addressExists) {
    const existingAddr = addresses.find(
      (addr) =>
        addr.name === name &&
        addr.phone === phone &&
        addr.addressLine === addressLine &&
        addr.city === city &&
        addr.state === state &&
        addr.pincode === pincode
    );
    return existingAddr._id;
  }

  try {
    const response = await addAddress(inlineAddress);
    console.log("addAddress response:", response); // ✅ check exact shape
    toast.success("Address saved to your profile!");
    if (refreshAddresses) await refreshAddresses();

    //  handle all possible response shapes
    return (
      response?.data?.address?._id ||
      response?.address?._id ||
      response?.data?._id ||
      response?._id ||
      null
    );
  } catch (error) {
    console.error("Failed to save address:", error);
    return null; // ✅ don't crash, just skip saving address
  }
};
  // VALIDATION
  const validateOrderData = () => {
    if (!cartItems.length) {
      toast.error("Cart is empty");
      return false;
    }

    if (addresses.length === 0) {
      const { name, phone, addressLine, city, state, pincode } = inlineAddress;

      if (!name || !phone || !addressLine || !city || !state || !pincode) {
        toast.error("Please fill delivery address");
        return false;
      }

      if (!/^\d{10}$/.test(phone)) {
        toast.error("Invalid phone number");
        return false;
      }

      if (!/^\d{6}$/.test(pincode)) {
        toast.error("Invalid pincode");
        return false;
      }
    } else {
      if (!selectedAddress) {
        toast.error("Select delivery address");
        return false;
      }
    }

    if (paymentMethod === "WALLET" && walletBalance < total) {
      toast.error("Insufficient wallet balance");
      return false;
    }

    return true;
  };

  // ORDER DATA
  const getOrderData = (savedAddressId = null) => {
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
      address:
        addresses.length === 0
          ? {
              fullName: inlineAddress.name,
              phone: inlineAddress.phone,
              addressLine: inlineAddress.addressLine,
              city: inlineAddress.city,
              state: inlineAddress.state,
              pincode: inlineAddress.pincode,
            }
          : {
              fullName: selectedAddress?.name,
              phone: selectedAddress?.phone,
              addressLine: selectedAddress?.addressLine,
              city: selectedAddress?.city,
              state: selectedAddress?.state,
              pincode: selectedAddress?.pincode,
            },
      addressId:
        savedAddressId ||
        (addresses.length === 0 ? null : selectedAddressId),
      coupon: appliedCoupon || "",
      paymentMethod,
    };
  };

  // PLACE ORDER
  const handlePlaceOrder = async () => {
    if (!validateOrderData()) return;

    setLoading(true);
    let savedAddressId = null;

    try {
      if (addresses.length === 0 && saveNewAddress) {
        savedAddressId = await saveAddressToProfile();
      }

      const orderData = getOrderData(savedAddressId);

      if (paymentMethod === "WALLET") {
        const res = await placeWalletOrder(orderData);
        await fetchCart();
        toast.success("Order placed successfully using wallet!");
        navigate("/order-success", { state: { order: res.data.order } });
        return;
      }

      if (paymentMethod === "COD") {
        const res = await placeCODOrder(orderData);
        await fetchCart();
        toast.success("Order placed successfully!");
        navigate("/order-success", { state: { order: res.data.order } });
        return;
      }

      // Razorpay
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Razorpay failed to load");
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
            navigate("/order-success", {
              state: { order: verifyRes.data.order },
            });
          } catch (err) {
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: selectedAddress?.name || inlineAddress.name || "",
          contact: selectedAddress?.phone || inlineAddress.phone || "",
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

  const isButtonDisabled =
    loading ||
    (!selectedAddress && addresses.length > 0) ||
    (paymentMethod === "WALLET" && walletBalance < total);

  const getButtonLabel = () => {
    if (paymentMethod === "WALLET")
      return `Pay with Wallet — ₹${total.toLocaleString("en-IN")}`;
    return `Place Order — ₹${total.toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>

        {/* ADDRESS SECTION */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Delivery Address</h3>

          {addresses.length === 0 ? (
            <>
              <div className="space-y-3">
                <input
                  placeholder="Full Name"
                  value={inlineAddress.name}
                  onChange={handleChange("name")}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                <input
                  placeholder="Phone Number"
                  value={inlineAddress.phone}
                  onChange={handleChange("phone")}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                <input
                  placeholder="Address Line"
                  value={inlineAddress.addressLine}
                  onChange={handleChange("addressLine")}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="City"
                    value={inlineAddress.city}
                    onChange={handleChange("city")}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  <input
                    placeholder="State"
                    value={inlineAddress.state}
                    onChange={handleChange("state")}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <input
                  placeholder="Pincode"
                  value={inlineAddress.pincode}
                  onChange={handleChange("pincode")}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveNewAddress}
                  onChange={(e) => setSaveNewAddress(e.target.checked)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">
                  Save this address to my profile for future orders
                </span>
              </label>
            </>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <label
                  key={addr._id}
                  className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition ${
                    selectedAddressId === addr._id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-200"
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedAddressId === addr._id}
                    onChange={() => setSelectedAddressId(addr._id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{addr.name}</p>
                    <p className="text-sm text-gray-600">{addr.addressLine}</p>
                    <p className="text-sm text-gray-600">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-sm text-gray-500">📞 {addr.phone}</p>
                  </div>
                </label>
              ))}

              <button
                onClick={() => navigate("/profile")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition"
              >
                <span>+</span>
                <span className="text-sm">Add New Address</span>
              </button>
            </div>
          )}
        </div>

        {/* ORDER SUMMARY */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 text-sm space-y-2">
          <h3 className="font-semibold mb-2 text-gray-800">Order Summary</h3>
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-800">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-800">₹{shipping.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-800">₹{tax.toLocaleString("en-IN")}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{discount.toLocaleString("en-IN")}</span>
            </div>
          )}
          {appliedCoupon && (
            <div className="flex justify-between text-indigo-600 text-xs">
              <span>Coupon Applied</span>
              <span className="font-mono">{appliedCoupon}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span className="text-gray-800">Total</span>
            <span className="text-indigo-600 text-lg">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Payment Method</h3>

          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer hover:border-indigo-200 transition">
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
              className="text-indigo-600"
            />
            <div>
              <span className="font-medium">Cash on Delivery</span>
              <p className="text-xs text-gray-500">Pay when you receive the order</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer hover:border-indigo-200 transition">
            <input
              type="radio"
              value="ONLINE"
              checked={paymentMethod === "ONLINE"}
              onChange={() => setPaymentMethod("ONLINE")}
              className="text-indigo-600"
            />
            <div>
              <span className="font-medium">Online Payment</span>
              <p className="text-xs text-gray-500">
                Credit/Debit Card, UPI, NetBanking
              </p>
            </div>
          </label>

          <label
            className={`flex items-center gap-3 p-3 border rounded-lg transition ${
              walletBalance < total
                ? "opacity-50 cursor-not-allowed border-gray-200"
                : "cursor-pointer hover:border-indigo-200 border-gray-200"
            }`}
          >
            <input
              type="radio"
              value="WALLET"
              checked={paymentMethod === "WALLET"}
              onChange={() => setPaymentMethod("WALLET")}
              disabled={walletBalance < total}
              className="text-purple-600"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">Pay with Wallet</span>
                <span className="text-sm font-semibold text-purple-600">
                  ₹{walletBalance.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500">Use your wallet balance</p>
            </div>
          </label>

          {walletBalance < total && (
            <div className="mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-700">
                ⚠️ Need ₹{(total - walletBalance).toFixed(2)} more to use wallet
              </p>
            </div>
          )}
        </div>

        {/* ✅ PLACE ORDER BUTTON — with spinner */}
        <button
          onClick={handlePlaceOrder}
          disabled={isButtonDisabled}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            isButtonDisabled
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Processing..." : getButtonLabel()}
          </span>
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;