import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map((item) => (
        <div key={item.productId} className="flex justify-between mb-3">
          <div>
            <h4>{item.name}</h4>
            <p>
              ₹ {item.price} × {item.quantity}
            </p>
          </div>

          <button
            onClick={() => removeFromCart(item.productId)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}

      <h3 className="mt-4 font-bold">Total: ₹ {total}</h3>
    </div>
  );
};

export default CartPage;