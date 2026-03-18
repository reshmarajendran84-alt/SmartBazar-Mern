import { useEffect } from "react"; 
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, loading, handleUpdate, handleRemove } = useCart();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const subtotal = cart.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const shipping = cart.items?.length > 0 ? 100 : 0;
  const tax = cart.items?.length > 0 ? 50 : 0;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-10">
      <h2 className="text-3xl font-bold mb-8 text-center md:text-left text-gray-800">Shopping Cart</h2>

      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6 rounded-xl shadow-lg">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" 
            alt="Empty Cart" 
            className="w-32 mb-6 animate-bounce"
          />
          <p className="text-gray-500 mb-6 text-lg font-medium">Your cart is empty</p>
          <Link
            to="/products"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.productId._id}
                className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-transform duration-200"
              >
                <img
                  src={item.productId?.images?.[0] || "https://via.placeholder.com/100"}
                  alt={item.productId?.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.productId?.name}</h3>
                    {item.productId.originalPrice && (
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-400 line-through">₹{item.productId.originalPrice}</p>
                        <p className="text-indigo-600 font-medium">₹{item.price}</p>
                      </div>
                    )}
                    {!item.productId.originalPrice && (
                      <p className="text-indigo-600 font-medium mt-1">₹{item.price}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleUpdate(item.productId._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50"
                    >-</button>

                    <span className="px-2">{item.quantity}</span>

                    <button
                      onClick={() => handleUpdate(item.productId._id, item.quantity + 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >+</button>

                    <button
                      onClick={() => handleRemove(item.productId._id)}
                      className="ml-auto text-red-600 hover:text-red-800 font-medium transition"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mt-1 gap-1">
                    <span className="text-yellow-400">★ ★ ★ ★ ☆</span>
                    <span className="text-gray-400 text-sm">(120 reviews)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:w-80 bg-white p-6 rounded-xl shadow-md flex-shrink-0 sticky top-20">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span>
                  {shipping > 0 ? `₹${shipping}` : <span className="text-green-600 font-semibold">Free</span>}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Desktop Checkout */}
            <button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition hidden md:block">
              Proceed to Checkout
            </button>
          </div>

          {/* Mobile Checkout Fixed Bottom */}
          <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t shadow md:hidden">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition">
              Proceed to Checkout
            </button>
          </div>

          {/* Continue Shopping Link */}
          <Link
            to="/products"
            className="inline-block mt-4 text-indigo-600 hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;