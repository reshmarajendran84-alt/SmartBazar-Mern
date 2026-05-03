import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiPrinter,
  FiDownload,
  FiPackage,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiShoppingBag,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const STATUS_OPTIONS = [
  { value: "Pending",   color: "bg-yellow-100 text-yellow-800 border-yellow-200", dot: "bg-yellow-500" },
  { value: "Confirmed", color: "bg-blue-100 text-blue-800 border-blue-200",       dot: "bg-blue-500"   },
  { value: "Shipped",   color: "bg-violet-100 text-violet-800 border-violet-200", dot: "bg-violet-500" },
  { value: "Delivered", color: "bg-green-100 text-green-800 border-green-200",    dot: "bg-green-500"  },
  { value: "Cancelled", color: "bg-red-100 text-red-800 border-red-200",          dot: "bg-red-500"    },
  { value: "Returned",  color: "bg-orange-100 text-orange-800 border-orange-200", dot: "bg-orange-500" },
];

const getStatusStyle = (status) =>
  STATUS_OPTIONS.find((o) => o.value === status) || STATUS_OPTIONS[0];

// Flipkart/Amazon style payment status
const PaymentStatusBadge = ({ order }) => {
  const isCOD =
    order.paymentMethod?.toLowerCase() === "cod" ||
    order.paymentMethod?.toLowerCase() === "cash on delivery";

  if (isCOD) {
    switch (order.status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Paid
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Not Charged
          </span>
        );
      case "Returned":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Refund N/A
          </span>
        );
      default:
        // Pending, Confirmed, Shipped
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Pay on Delivery
          </span>
        );
    }
  }

  // Online payment
  switch (order.status) {
    case "Pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Unpaid
        </span>
      );
    case "Cancelled":
    case "Returned":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Refunded
        </span>
      );
    default:
      // Confirmed, Shipped, Delivered
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Paid
        </span>
      );
  }
};

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder]                   = useState(null);
  const [loading, setLoading]               = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [downloading, setDownloading]       = useState(false);
  const [expandedItems, setExpandedItems]   = useState({});

  const toggleItemExpand = (index) =>
    setExpandedItems((prev) => ({ ...prev, [index]: !prev[index] }));

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/${id}`);
      const o = data.order || data;
      setOrder(o);
      setSelectedStatus(o.status);
    } catch {
      toast.error("Failed to load order");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchOrder(); }, [id]);

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) { toast("Status unchanged"); return; }
    try {
      setUpdatingStatus(true);
      await api.put(`/orders/${id}/status`, { status: selectedStatus });
      toast.success(`Status updated to ${selectedStatus}`);
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      const res = await api.get(`/orders/${id}/invoice`, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const a = Object.assign(document.createElement("a"), {
        href: url,
        download: `invoice_${id.slice(-8)}.pdf`,
      });
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Invoice downloaded");
    } catch {
      toast.error("Invoice download failed");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Loading order details...</p>
    </div>
  );

  if (!order) return null;

  const statusStyle = getStatusStyle(order.status);
  const subtotal = order.cartItems?.reduce((s, i) => s + i.price * i.quantity, 0) ?? order.subtotal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-5">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 mb-4 transition group"
          >
            <FiArrowLeft size={14} className="group-hover:-translate-x-0.5 transition" />
            Back to orders
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Order Details</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs sm:text-sm text-gray-500 font-mono">
                  Order #{order._id?.slice(-8).toUpperCase()}
                </p>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyle.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                  {order.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg hover:bg-gray-100 bg-white transition shadow-sm"
              >
                <FiPrinter size={14} />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                onClick={handleDownloadInvoice}
                disabled={downloading}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 shadow-sm"
              >
                <FiDownload size={14} />
                <span className="hidden sm:inline">{downloading ? "Downloading..." : "Download Invoice"}</span>
                <span className="sm:hidden">{downloading ? "..." : "Invoice"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">

            {/* Status Update */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FiPackage size={16} className="text-indigo-500" />
                  <span className="text-sm font-semibold text-gray-700">Update Order Status</span>
                </div>
              </div>
              <div className="p-4 md:p-5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.value}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={updatingStatus}
                    className="px-4 py-2.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-medium shadow-sm"
                  >
                    {updatingStatus ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiShoppingBag size={16} className="text-indigo-500" />
                    <span className="text-sm font-semibold text-gray-700">Order Items</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {order.cartItems?.length || 0} items
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {order.cartItems?.map((item, i) => {
                  const pid = item.productId?._id || item.productId;
                  const isExpanded = expandedItems[i];
                  return (
                    <div key={i} className="p-4 hover:bg-gray-50 transition">

                      {/* Desktop */}
                      <div className="hidden sm:flex gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0">
                          {item.image
                            ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{item.name}</p>
                          <p className="text-[11px] text-gray-400 font-mono mt-0.5 mb-2">
                            SKU: {pid?.slice(-8).toUpperCase() || "N/A"}
                          </p>
                          <div className="flex gap-4 text-xs text-gray-500">
                            <span>Quantity: {item.quantity}</span>
                            <span>Price: ₹{item.price.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-indigo-600">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* Mobile */}
                      <div className="sm:hidden">
                        <div className="flex gap-3">
                          <div className="w-20 h-20 rounded-lg bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0">
                            {item.image
                              ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                            }
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                            <p className="text-xs text-gray-500">₹{item.price.toLocaleString("en-IN")} each</p>
                            <p className="text-sm font-bold text-indigo-600 mt-1">
                              Total: ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <button onClick={() => toggleItemExpand(i)} className="self-start p-1">
                            {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                          </button>
                        </div>
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">SKU:</span> {pid?.slice(-8).toUpperCase() || "N/A"}
                            </p>
                            {item.description && (
                              <p className="text-xs text-gray-500 mt-1">
                                <span className="font-medium">Description:</span> {item.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4 md:space-y-6">

            {/* Customer */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FiUser size={16} className="text-indigo-500" />
                  <span className="text-sm font-semibold text-gray-700">Customer Information</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {(() => {
                  const name =
                    order.userId?.name?.trim() ||
                    order.address?.fullName?.trim() ||
                    order.userId?.email?.split("@")[0] ||
                    "Guest";
                  const email = order.userId?.email || order.address?.email || "No email";
                  const phone = order.userId?.phone || order.address?.phone || "";
                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{name}</p>
                          <p className="text-xs text-gray-500 break-all">{email}</p>
                        </div>
                      </div>
                      {phone && (
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Phone:</span> {phone}
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FiMapPin size={16} className="text-indigo-500" />
                  <span className="text-sm font-semibold text-gray-700">Shipping Address</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-gray-800">{order.address?.fullName || "N/A"}</p>
                <div className="text-xs text-gray-600 mt-2 space-y-0.5 leading-relaxed">
                  <p>{order.address?.addressLine}</p>
                  <p>{order.address?.city}, {order.address?.state}</p>
                  <p>PIN Code: {order.address?.pincode || "N/A"}</p>
                  {order.address?.landmark && <p>Landmark: {order.address.landmark}</p>}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FiCreditCard size={16} className="text-indigo-500" />
                  <span className="text-sm font-semibold text-gray-700">Payment Details</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Payment Method</span>
                  <span className="text-xs font-medium text-gray-700 capitalize">
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod || "Online Payment"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Payment Status</span>
                  <PaymentStatusBadge order={order} />
                </div>
                {order.transactionId && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Transaction ID:</span>
                      <br />
                      <span className="text-[10px] font-mono break-all">{order.transactionId}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-700">Order Summary</span>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-700">₹{subtotal?.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-700">₹{order.shipping?.toFixed(2) ?? "49.00"}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount</span>
                    <span className="text-green-600">- ₹{order.discount?.toFixed(2)}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax (GST)</span>
                    <span className="text-gray-700">₹{order.tax?.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-800">Total Amount</span>
                    <span className="text-lg font-bold text-indigo-600">
                      ₹{order.total?.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 text-right mt-1">Inclusive of all taxes</p>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Order Date</span>
                  <span className="text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;