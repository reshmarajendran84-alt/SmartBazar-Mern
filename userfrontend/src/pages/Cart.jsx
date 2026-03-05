import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = 100;
  const tax = 50;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Cart */}
      <main className="flex-1 p-8">

        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500">Cart is empty</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">

            {/* Table Header */}
            <div className="grid grid-cols-5 font-semibold border-b p-4 bg-gray-100">
              <span>Product</span>
              <span>Name</span>
              <span>Qty</span>
              <span>Price</span>
              <span>Remove</span>
            </div>

            {/* Cart Items */}
            {cart.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-5 items-center p-4 border-b"
              >
                <img
                  src={`http://localhost:5000/${item.images?.[0]}`}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />

                <span>{item.name}</span>

                {/* Quantity Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="px-2 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQty(item._id)}
                    className="px-2 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>

                <span className="font-semibold text-blue-600">
                  ₹{item.price * item.quantity}
                </span>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 font-semibold"
                >
                  Remove
                </button>
              </div>
            ))}

          </div>
        )}

        {/* Order Summary */}

        <div className="bg-white rounded-lg shadow mt-6 p-6 w-96 ml-auto">

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

          <button className="w-full bg-indigo-600 text-white py-2 rounded mt-4 hover:bg-indigo-700">
            Checkout
          </button>

        </div>

      </main>
    </div>
  );
};

export default CartPage;