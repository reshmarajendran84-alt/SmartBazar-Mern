import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { validateCoupon } from "../services/couponService";

const CartPage = () => {
  const { cart, loading, handleUpdate, handleRemove } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setDiscount(0);
  }, [cart.items]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const normalizeItem = (item) => {
    if (item.productId && typeof item.productId === "object") return item;
    return {
      ...item,
      productId: {
        _id: item.productId,
        name: item.name,
        images: item.image ? [item.image] : [],
      },
    };
  };

  const mergeDuplicates = (items) => {
    const map = {};
    for (const item of items) {
      const id = item.productId?._id || item.productId;
      if (!id) continue;
      map[id]
        ? (map[id].quantity += item.quantity)
        : (map[id] = { ...item });
    }
    return Object.values(map);
  };

  const validItems = mergeDuplicates(
    (cart.items?.filter(i => i.productId) || []).map(normalizeItem)
  );

  const subtotal = validItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const shipping = validItems.length ? 100 : 0;
  const tax = validItems.length ? 50 : 0;
  const totalBeforeDiscount = subtotal + shipping + tax;
  const finalTotal = Math.max(totalBeforeDiscount - discount, 0);

const handleApplyCoupon = async () => {
  if (!couponCode) return toast.warning("Enter coupon code");

  try {
    const res = await validateCoupon({
      code: couponCode.trim(),
      subtotal,
    });
    const value = Number(res.data?.discount || 0);
    setDiscount(value);
    setAppliedCoupon(couponCode);
    toast.success(`Saved ₹${value} 🎉`);
  } catch (err) {
    console.log("Error response:", err.response?.data); // ← ADD THIS
    console.log("Status:", err.response?.status);
    setDiscount(0);
    toast.error(err.response?.data?.message || "Invalid coupon"); // ← show actual message
  }
};
  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleCheckout = () => {
    if (!validItems.length) return toast.warning("Cart empty");

    navigate("/checkout", {
      state: {
        cartItems: validItems,
        subtotal,
        shipping,
        tax,
        discount,
        total: finalTotal,
        appliedCoupon,
      },
    });
  };

  // ─────────────────────────────────────────

  if (!validItems.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          className="w-32 mb-4 opacity-80"
        />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Your cart is empty
        </h2>
        <Link
          to="/products"
          className="mt-3 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 md:px-8 py-6">

      <h1 className="text-2xl md:text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          {validItems.map((item) => (
            <div
              key={item.productId._id}
              className="bg-white p-4 rounded-xl shadow flex gap-4 hover:shadow-lg transition"
            >
              <img
                src={item.productId.images?.[0]}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {item.productId.name}
                </h3>

                <p className="text-indigo-600 font-medium mt-1">
                  ₹{item.price}
                </p>

                {/* Quantity */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() =>
                      handleUpdate(item.productId._id, item.quantity - 1)
                    }
                    className="w-8 h-8 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      handleUpdate(item.productId._id, item.quantity + 1)
                    }
                    className="w-8 h-8 bg-gray-200 rounded"
                  >
                    +
                  </button>

                  <button
                    onClick={() => handleRemove(item.productId._id)}
                    className="ml-auto text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Link to="/products" className="text-indigo-600 text-sm">
            ← Continue Shopping
          </Link>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-5 rounded-xl shadow h-fit sticky top-20">

          <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

          <div className="space-y-2 text-sm">
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

            {/* Coupon */}
            <div className="mt-3 border p-3 rounded">
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    value={couponCode}
  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon"
                    className="flex-1 border px-2 py-1 rounded"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-green-600 text-white px-3 rounded"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-green-600 text-sm">
                    {appliedCoupon}
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-red-500 text-xs"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full mt-5 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
          >
            Checkout
          </button>
        </div>
      </div>

      {/* MOBILE BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-3 flex justify-between md:hidden shadow">
        <span className="font-bold">₹{finalTotal}</span>
        <button
          onClick={handleCheckout}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;