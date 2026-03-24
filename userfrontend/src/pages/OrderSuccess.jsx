import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">No order found.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Order Confirmed 🎉</h2>
      <p>Order ID: {order._id}</p>
      <p>Status: {order.orderStatus}</p>
      <p>Payment: {order.paymentMethod === "COD" ? "Pending (COD)" : "Paid (Online)"}</p>
      <p>Total: ₹{order.total}</p>

      <h3 className="font-semibold mt-4 mb-2">Items:</h3>
      {order.items?.map((item, idx) => (
        <div key={idx} className="flex justify-between border-b py-1">
          <span>{item.name} x {item.quantity}</span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}

      <button
        onClick={() => navigate("/orders")}
        className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        View My Orders
      </button>
    </div>
  );
};

export default OrderSuccess;