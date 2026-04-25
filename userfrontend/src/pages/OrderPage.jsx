import { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const FILTERS = ["All", "On the Way", "Delivered", "Cancelled", "Returns"];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [addingItem, setAddingItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/order/my-orders")
      .then(({ data }) => setOrders(data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleBuyAgain = async (item) => {
    try {
      setAddingItem(item.productId);
      await api.post("/cart/add", {
        productId: item.productId,
        quantity: 1,
        price: item.price,
        name: item.name,
        image: item.image,
      });
      navigate("/cart");
    } catch (err) {
      toast.error("Failed to add item");
    } finally {
      setAddingItem(null);
    }
  };

  const filtered = orders.filter((o) => {
    if (filter === "All") return true;
    if (filter === "On the Way") return o.status === "Shipped";
    if (filter === "Delivered") return o.status === "Delivered";
    if (filter === "Cancelled") return ["Cancelled", "Failed"].includes(o.status);
    if (filter === "Returns") return ["Returned", "Return_requested"].includes(o.status);
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4">
        <p className="text-6xl">📦</p>
        <h3 className="text-xl font-semibold">No Orders Yet</h3>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-3 sm:px-6 py-6">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          My Orders
        </h1>
      </div>

      {/* FILTERS */}
      <div className="max-w-6xl mx-auto mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-sm rounded-full border transition
              ${filter === f
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ORDERS */}
      <div className="max-w-6xl mx-auto space-y-4">

        {filtered.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
          >

            {/* ORDER HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b gap-2">
              <div>
                <p className="text-xs text-gray-400">
                  Order #{order._id?.slice(-8).toUpperCase()}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div className="text-sm font-semibold text-indigo-600">
                ₹{order.total}
              </div>
            </div>

            {/* ITEMS */}
            <div className="p-4 space-y-4">
              {order.cartItems?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row gap-4 border-b pb-4 last:border-none"
                >
                  <img
                    src={item.image || "/placeholder.jpg"}
                    className="w-24 h-24 object-cover rounded-lg"
                    alt={item.name}
                  />

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 line-clamp-2">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>

                    <p className="text-sm font-semibold text-gray-800">
                      ₹{item.price * item.quantity}
                    </p>

                    {/* STATUS */}
                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-600">
                      {order.status}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-row sm:flex-col gap-2 sm:items-end">

                    <Link
                      to={`/orders/${order._id}`}
                      className="text-xs border px-3 py-1 rounded hover:bg-gray-100"
                    >
                      Details
                    </Link>

                    <button
                      onClick={() => handleBuyAgain(item)}
                      disabled={addingItem === item.productId}
                      className="text-xs border border-orange-500 text-orange-600 px-3 py-1 rounded hover:bg-orange-50"
                    >
                      {addingItem === item.productId ? "Adding..." : "Buy Again"}
                    </button>

                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default OrdersPage;