import { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const FILTERS = ["All", "Pending", "On the Way", "Delivered", "Cancelled", "Returns"];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [addingItem, setAddingItem] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnDescription, setReturnDescription] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/order/my-orders");
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Cancel Order Handler
  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      setCancellingOrder(orderId);
      const response = await api.put(`/order/${orderId}/cancel`);
      if (response.data.success) {
        toast.success("Order cancelled successfully!");
        await fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancellingOrder(null);
    }
  };

  // Buy Again Handler
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
      toast.success("Item added to cart!");
      navigate("/cart");
    } catch (err) {
      toast.error("Failed to add item");
    } finally {
      setAddingItem(null);
    }
  };

  // Return Request Handler
  const handleReturnRequest = async () => {
    if (!returnReason) {
      toast.error("Please select a reason for return");
      return;
    }

    try {
      setSubmittingReturn(true);
      const response = await api.post(`/returns/request/${selectedOrder._id}`, {
        reason: returnReason,
        description: returnDescription
      });
      
      if (response.data.success) {
        toast.success("Return request submitted successfully! Admin will review your request.");
        setShowReturnModal(false);
        setReturnReason("");
        setReturnDescription("");
        setSelectedOrder(null);
        await fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error("Error submitting return:", error);
      toast.error(error.response?.data?.message || "Failed to submit return request");
    } finally {
      setSubmittingReturn(false);
    }
  };

  const openReturnModal = (order) => {
    // Check if return is allowed
    if (order.status !== "Delivered") {
      toast.error("Only delivered orders can be returned");
      return;
    }
    if (order.returnRequested) {
      toast.error("Return already requested for this order");
      return;
    }
    if (order.status === "Return_requested") {
      toast.error("Return request already pending");
      return;
    }
    if (order.status === "Returned") {
      toast.error("Order has already been returned");
      return;
    }
    if (order.status === "Return_rejected") {
      toast.error("Return request was rejected for this order");
      return;
    }
    
    setSelectedOrder(order);
    setShowReturnModal(true);
  };

  // Filter orders
  const filtered = orders.filter((o) => {
    if (filter === "All") return true;
    if (filter === "Pending") return o.status === "Pending" || o.status === "Confirmed";
    if (filter === "On the Way") return o.status === "Shipped";
    if (filter === "Delivered") return o.status === "Delivered";
    if (filter === "Cancelled") return ["Cancelled", "Failed"].includes(o.status);
    if (filter === "Returns") return ["Returned", "Return_requested", "Return_rejected"].includes(o.status);
    return true;
  });

  // Helper to get status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case "Delivered": return "bg-green-100 text-green-700";
      case "Cancelled": return "bg-red-100 text-red-600";
      case "Returned": return "bg-purple-100 text-purple-700";
      case "Return_requested": return "bg-yellow-100 text-yellow-700";
      case "Return_rejected": return "bg-orange-100 text-orange-700";
      case "Shipped": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Helper to get return status badge
  const getReturnStatusBadge = (order) => {
    if (order.status === "Return_requested") {
      return { text: "Return Pending", color: "bg-yellow-100 text-yellow-800", icon: "⏳" };
    }
    if (order.status === "Returned") {
      return { text: "Returned", color: "bg-green-100 text-green-800", icon: "✅" };
    }
    if (order.status === "Return_rejected") {
      return { text: "Return Rejected", color: "bg-red-100 text-red-800", icon: "❌" };
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
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
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
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
        <p className="text-sm text-gray-500 mt-1">Manage your orders, track status, request returns or cancel</p>
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

      {/* ORDERS LIST */}
      <div className="max-w-6xl mx-auto space-y-4">
        {filtered.map((order) => {
          const returnBadge = getReturnStatusBadge(order);
          const canCancel = order.status === "Pending" || order.status === "Confirmed";
          const canRequestReturn = order.status === "Delivered" && 
            !order.returnRequested && 
            order.status !== 'Return_requested' && 
            order.status !== 'Returned' && 
            order.status !== 'Return_rejected';

          return (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* ORDER HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b bg-gray-50">
                <div>
                  <p className="text-xs text-gray-500 font-mono">
                    Order #{order._id?.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                  <span className={`text-sm font-semibold ${getStatusBadge(order.status)} px-3 py-1 rounded-full`}>
                    {order.status}
                  </span>
                  <div className="text-lg font-bold text-indigo-600">
                    ₹{order.total.toLocaleString()}
                  </div>
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
                      onError={(e) => e.target.src = "/placeholder.jpg"}
                    />

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        ₹{item.price.toLocaleString()} each
                      </p>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-row sm:flex-col gap-2 sm:items-end">
                      <Link
                        to={`/orders/${order._id}`}
                        className="text-xs border border-indigo-500 text-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-50 text-center"
                      >
                        View Details
                      </Link>

                      <button
                        onClick={() => handleBuyAgain(item)}
                        disabled={addingItem === item.productId}
                        className="text-xs border border-orange-500 text-orange-600 px-3 py-1.5 rounded hover:bg-orange-50 disabled:opacity-50"
                      >
                        {addingItem === item.productId ? "Adding..." : "Buy Again"}
                      </button>

                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingOrder === order._id}
                          className="text-xs border border-red-500 text-red-600 px-3 py-1.5 rounded hover:bg-red-50 disabled:opacity-50"
                        >
                          {cancellingOrder === order._id ? "Cancelling..." : "Cancel Order"}
                        </button>
                      )}

                      {canRequestReturn && (
                        <button
                          onClick={() => openReturnModal(order)}
                          className="text-xs border border-yellow-500 text-yellow-600 px-3 py-1.5 rounded hover:bg-yellow-50"
                        >
                          Request Return
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* RETURN STATUS BANNER (if applicable) */}
              {returnBadge && (
                <div className="px-4 pb-4">
                  <div className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded ${returnBadge.color}`}>
                    <span>{returnBadge.icon}</span>
                    <span>{returnBadge.text}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* RETURN REQUEST MODAL */}
      {showReturnModal && selectedOrder && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowReturnModal(false);
              setReturnReason("");
              setReturnDescription("");
            }
          }}
        >
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Request Return</h2>
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setReturnReason("");
                  setReturnDescription("");
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              Order: <span className="font-mono">#{selectedOrder._id?.slice(-8).toUpperCase()}</span>
            </p>
            
            <p className="text-xs text-gray-500 mb-4 bg-yellow-50 p-2 rounded">
              ⏳ Your return request will be reviewed by admin. You'll receive a refund to your wallet if approved.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Return *
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
              >
                <option value="">Select a reason</option>
                <option value="damaged">Product is damaged</option>
                <option value="wrong_item">Wrong item received</option>
                <option value="size_issue">Size/Fit issue</option>
                <option value="quality_issue">Quality issue</option>
                <option value="not_as_described">Not as described</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={returnDescription}
                onChange={(e) => setReturnDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none resize-none"
                rows="3"
                placeholder="Please provide additional details about the issue..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setReturnReason("");
                  setReturnDescription("");
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium transition"
                disabled={submittingReturn}
              >
                Cancel
              </button>
              <button
                onClick={handleReturnRequest}
                disabled={submittingReturn || !returnReason}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submittingReturn ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;