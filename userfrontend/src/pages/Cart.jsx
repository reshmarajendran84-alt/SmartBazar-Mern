import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = cart.length > 0 ? 100 : 0;
  const tax = cart.length > 0 ? 50 : 0;
  const total = subtotal + shipping + tax;

  const handleIncrease = (id) => {
    increaseQty(id);
    toast.success("Quantity increased");
  };

  const handleDecrease = (id) => {
    decreaseQty(id);
    toast.info("Quantity decreased");
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    toast.error("Product removed");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-lg shadow">
          <p className="text-gray-500 mb-4">Your cart is empty</p>

          <Link
            to="/"
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow">

            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center gap-4 p-4 border-b"
              >

                {/* Product Image */}
                <img
                  src={item.images?.[0] || "/no-image.png"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg border"
                />

                {/* Product Info */}
                <div className="flex-1">

                  <h3 className="font-semibold text-gray-800">
                    {item.name}
                  </h3>

                  <p className="text-indigo-600 font-bold mt-1">
                    ₹{item.price}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 mt-3">

                    <button
                      onClick={() => handleDecrease(item._id)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>

                    <span className="font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleIncrease(item._id)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>

                  </div>

                </div>

                {/* Total Price */}
                <div className="text-lg font-semibold text-gray-700">
                  ₹{item.price * item.quantity}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>

              </div>
            ))}

          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow p-6 h-fit sticky top-20">

            <h3 className="text-lg font-bold mb-4">Order Summary</h3>

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>₹{tax}</span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-4 hover:bg-indigo-700 transition">
              Proceed to Checkout
            </button>

          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;