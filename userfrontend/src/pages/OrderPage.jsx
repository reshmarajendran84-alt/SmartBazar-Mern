import { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const statusConfig = (status) => {
  if (status === "Delivered")
    return { dot: "bg-green-600", text: "text-green-700", label: "Delivered" };
  if (status === "Shipped")
    return { dot: "bg-blue-700", text: "text-blue-700", label: "Shipped" };
  if (status === "Pending" || status === "Confirmed")
    return { dot: "bg-orange-500", text: "text-orange-600", label: status };
  if (["Cancelled", "Failed"].includes(status))
    return { dot: "bg-red-700", text: "text-red-700", label: status };
  return { dot: "bg-gray-400", text: "text-gray-500", label: status };
};

const paymentLabel = (method) => {
  switch (method) {
    case "COD":    return "Cash on Delivery";
    case "WALLET": return "Wallet";
    case "ONLINE": return "Online Payment";
    default:       return method || "Unknown";
  }
};

const FILTERS = ["All", "On the Way", "Delivered", "Cancelled", "Returns"];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [addingItem, setAddingItem] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
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
      console.error("Buy again failed:", err);
      toast.error(err?.response?.data?.message || "Could not add to cart. Please try again.");
    } finally {
      setAddingItem(null);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      setDownloadingId(orderId);
      const response = await api.get(`/order/invoice/${orderId}`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId.slice(-8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      toast.error('Failed to download invoice');
    } finally {
      setDownloadingId(null);
    }
  };

  const filtered = orders.filter((o) => {
    if (filter === "All") return true;
    if (filter === "On the Way") return o.status === "Shipped";
    if (filter === "Delivered") return o.status === "Delivered";
    if (filter === "Cancelled") return ["Cancelled", "Failed"].includes(o.status);
    if (filter === "Returns") return ["Returned", "Return_requested", "Return_rejected"].includes(o.status);
    return true;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f3f6]">
      <p className="text-gray-500 animate-pulse">Loading orders...</p>
    </div>
  );

  if (!orders.length) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#f1f3f6] px-4">
      <div className="text-center">
        <p className="text-7xl mb-4">📦</p>
        <h3 className="text-gray-800 text-xl font-semibold">No orders yet</h3>
        <p className="text-gray-400 text-sm mt-1">Your orders will appear here</p>
      </div>
      <button onClick={() => navigate("/")}
        className="bg-[#2874f0] text-white px-8 py-2.5 rounded font-semibold hover:bg-blue-700 transition">
        Start Shopping
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Top bar */}
        <div className="bg-[#2874f0] rounded-t-lg px-5 py-3 flex items-center justify-between">
          <h2 className="text-white font-medium text-base tracking-wide">My Orders</h2>
          <span className="text-blue-200 text-xs">{orders.length} order(s)</span>
        </div>

        {/* Filter bar */}
        <div className="bg-white border-x border-b border-gray-200 px-5 py-2.5 flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border transition
                ${filter === f
                  ? "bg-orange-50 border-orange-400 text-orange-700 font-medium"
                  : "border-gray-300 text-gray-500 hover:bg-gray-50"}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="mt-3 space-y-3">
          {filtered.map((order) => {
            const st = statusConfig(order.status);
            const isCancelled = ["Cancelled", "Failed"].includes(order.status);

            return (
              <div key={order._id} className="bg-white border border-gray-200 rounded overflow-hidden">
                {/* Order header */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-6">
                    {[
                      ["Order placed", new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })],
                      ["Total", `₹${order.total}`],
                      ["Payment", paymentLabel(order.paymentMethod)],
                    ].map(([label, val]) => (
                      <div key={label} className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wide text-gray-400">{label}</span>
                        <span className="text-sm font-medium text-gray-800">{val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      ORDER # <strong className="text-gray-700">{order._id?.slice(-8).toUpperCase()}</strong>
                    </span>
                    <button
                      onClick={() => handleDownloadInvoice(order._id)}
                      disabled={downloadingId === order._id}
                      className="text-xs border border-[#2874f0] text-[#2874f0] px-2.5 py-1 rounded hover:bg-blue-50 transition disabled:opacity-50"
                    >
                      {downloadingId === order._id ? "Downloading..." : "Invoice"}
                    </button>
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-xs border border-[#2874f0] text-[#2874f0] px-2.5 py-1 rounded hover:bg-blue-50 transition"
                    >
                      {order.status === "Shipped" ? "Track Order" : "View Details"}
                    </Link>
                  </div>
                </div>

                {/* Rest of your table code remains the same */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wide text-gray-400 font-medium">Product</th>
                        <th className="px-4 py-2.5 text-center text-[10px] uppercase tracking-wide text-gray-400 font-medium">Qty</th>
                        <th className="px-4 py-2.5 text-center text-[10px] uppercase tracking-wide text-gray-400 font-medium">Price</th>
                        <th className="px-4 py-2.5 text-center text-[10px] uppercase tracking-wide text-gray-400 font-medium">Status</th>
                        <th className="px-4 py-2.5 text-center text-[10px] uppercase tracking-wide text-gray-400 font-medium">Delivery</th>
                        <th className="px-4 py-2.5 text-center text-[10px] uppercase tracking-wide text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.cartItems?.map((item, idx) => (
                        <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
                                    className="w-14 h-14 rounded object-cover border border-gray-200 hover:opacity-90 transition"
                                  />
                                ) : (
                                  <div className="w-14 h-14 rounded border border-gray-200 bg-gray-100" />
                                )}
                              </Link>
                              <div className="min-w-0">
                                <Link to={`/product/${item.productId}`} className="text-sm font-medium text-gray-900 hover:text-[#2874f0] transition line-clamp-2">
                                  {item.name}
                                </Link>
                                <p className="text-xs text-gray-400 mt-0.5">Seller: ShopMart</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-700">{item.quantity}</td>
                          <td className="px-4 py-3 text-center text-sm font-medium text-gray-800">₹{item.price * item.quantity}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${st.dot}`} />
                              <span className={`text-xs font-medium ${st.text}`}>{st.label}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-xs">
                            {!isCancelled ? (
                              <span className="text-green-700 font-medium">
                                {order.status === "Delivered"
                                  ? `Delivered ${new Date(order.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
                                  : `By ${new Date(Date.now() + 2 * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                              </span>
                            ) : (
                              isCancelled && order.paymentMethod !== "COD" && (
                                <span className="text-red-600 font-medium">Refund ₹{order.total} → wallet</span>
                              )
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex flex-col items-center gap-1.5">
                              {order.status === "Delivered" && (
                                <Link to={`/products/${item.productId?._id || item.productId}`} className="text-xs border border-[#2874f0] text-[#2874f0] px-2.5 py-1 rounded hover:bg-blue-50 transition whitespace-nowrap">
                                  Rate & Review
                                </Link>
                              )}
                              {order.status === "Delivered" && !order.returnRequested && (
                                <Link to={`/orders/${order._id}?action=return`} className="text-xs border border-green-600 text-green-700 px-2.5 py-1 rounded hover:bg-green-50 transition whitespace-nowrap">
                                  Return
                                </Link>
                              )}
                              <button onClick={() => handleBuyAgain(item)} disabled={addingItem === item.productId} className="text-xs border border-orange-500 text-orange-600 px-2.5 py-1 rounded hover:bg-orange-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                                {addingItem === item.productId ? (
                                  <>
                                    <span className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                                    Adding...
                                  </>
                                ) : "Buy Again"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                  <span className="text-xs text-gray-500">
                    Order total: <strong className="text-gray-800">₹{order.total}</strong>
                    &nbsp;·&nbsp;{order.cartItems?.length} item(s)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;