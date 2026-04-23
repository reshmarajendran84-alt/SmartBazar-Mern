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

  // Reset discount whenever cart items change
  useEffect(() => {
    setDiscount(0);
  }, [cart.items]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  const normalizeItem = (item) => {
    // DB item — productId is a populated object
    if (item.productId && typeof item.productId === "object") return item;

    // Guest item — productId is a plain string ID
    return {
      ...item,
      productId: {
        _id:    item.productId,
        name:   item.name,
        images: item.image ? [item.image] : [],
      },
    };
  };

  // Merge duplicate products by productId, summing quantities
  const mergeDuplicates = (items) => {
    const map = {};
    for (const item of items) {
      const id = item.productId?._id || item.productId;
      if (!id) continue;
      if (map[id]) {
        map[id] = { ...map[id], quantity: map[id].quantity + item.quantity };
      } else {
        map[id] = { ...item };
      }
    }
    return Object.values(map);
  };

  // Filter out deleted products, normalize, then deduplicate
  const validItems = mergeDuplicates(
    (cart.items?.filter(
      (item) => item.productId !== null && item.productId !== undefined
    ) || []).map(normalizeItem)
  );

  // Calculations
  const subtotal = validItems.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const shipping = validItems.length > 0 ? 100 : 0;
  const tax = validItems.length > 0 ? 50 : 0;
  const totalBeforeDiscount = subtotal + shipping + tax;
  const finalTotal = Math.max(totalBeforeDiscount - discount, 0);

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode) return toast.warning("Enter coupon code");

    try {
      const res = await validateCoupon({
        code: couponCode.toUpperCase().trim(),
        subtotal,
      });

      const discountValue = Number(res.data?.discount || 0);
      setDiscount(discountValue);
      setAppliedCoupon(couponCode.toUpperCase().trim());

      toast.success(`Coupon applied! You saved ₹${discountValue} 🎉`);
    } catch (err) {
      setDiscount(0);
      toast.error(err.response?.data?.message || "Invalid coupon");
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  // Proceed to checkout
  const handleProceedToCheckout = () => {
    if (validItems.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }

    const formattedItems = validItems.map((item) => ({
      productId: item.productId,
      name: item.productId?.name || item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    navigate("/checkout", {
      state: {
        cartItems: formattedItems,
        subtotal,
        shipping,
        tax,
        discount,
        total: finalTotal,
        appliedCoupon,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-4 md:px-6 lg:px-10 py-6">

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Shopping Cart
      </h2>

      {validItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]
          bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100
          rounded-2xl shadow-lg p-6 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            className="w-28 sm:w-32 mb-5 animate-bounce"
            alt="empty cart"
          />
          <p className="text-gray-600 text-lg mb-5">Your cart is empty</p>
          <Link
            to="/products"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT — CART ITEMS */}
          <div className="flex-1 space-y-4">
            {validItems.map((item) => (
              <div
                key={item.productId?._id}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 hover:shadow-xl transition"
              >
                <img
                  src={
                    item.productId?.images?.[0] ||
                    "https://via.placeholder.com/100"
                  }
                  className="w-24 h-24 rounded-lg object-cover mx-auto sm:mx-0"
                  alt={item.productId?.name || "Product"}
                />

                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {item.productId?.name ?? "Product unavailable"}
                  </h3>

                  {item.productId?.originalPrice ? (
                    <div className="flex items-center gap-2">
                      <p className="text-gray-400 line-through text-sm">
                        ₹{item.productId.originalPrice}
                      </p>
                      <p className="text-indigo-600 font-medium">
                        ₹{item.price}
                      </p>
                    </div>
                  ) : (
                    <p className="text-indigo-600 font-medium">₹{item.price}</p>
                  )}

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdate(item.productId?._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
                    >
                      -
                    </button>

                    <span className="px-1">{item.quantity}</span>

                    <button
                      onClick={() =>
                        handleUpdate(item.productId?._id, item.quantity + 1)
                      }
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      +
                    </button>

                    <button
                      onClick={() => handleRemove(item.productId?._id)}
                      className="ml-auto text-red-500 hover:text-red-700 text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <Link
              to="/products"
              className="inline-block mt-2 text-indigo-600 hover:underline text-sm"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div className="lg:w-80 bg-white rounded-xl shadow-md p-5 sticky top-20 h-fit">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Order Summary
            </h3>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping > 0 ? (
                    `₹${shipping}`
                  ) : (
                    <span className="text-green-600 font-semibold">Free</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>

              {/* Coupon Section */}
              <div className="mt-3 bg-gray-50 border rounded-lg p-3">
                {!appliedCoupon ? (
                  <>
                    <p className="text-xs text-gray-500 mb-2">
                      Have a coupon?
                    </p>
                    <div className="flex gap-2">
                      <input
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="Coupon code"
                        className="flex-1 border p-2 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 rounded text-sm transition"
                      >
                        Apply
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-green-600 font-medium text-sm">
                        ✔ {appliedCoupon} applied
                      </p>
                      <p className="text-xs text-gray-500">
                        You saved ₹{discount}
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              <hr className="my-2" />

              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            {/* Desktop Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition hidden md:block"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* Mobile bottom bar */}
      {validItems.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow p-3 flex justify-between items-center md:hidden z-50">
          <span className="font-bold text-lg text-gray-800">₹{finalTotal}</span>
          <button
            onClick={handleProceedToCheckout}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;