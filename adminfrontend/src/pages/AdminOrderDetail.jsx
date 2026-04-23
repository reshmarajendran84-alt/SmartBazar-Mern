import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-hot-toast";

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [downloading, setDownloading] = useState(false);

  const statusOptions = [
    { value: "Pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "Confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
    { value: "Shipped", label: "Shipped", color: "bg-purple-100 text-purple-800" },
    { value: "Delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
    { value: "Cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
    { value: "Returned", label: "Returned", color: "bg-orange-100 text-orange-800" },
  ];

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.order || response.data);
      setSelectedStatus(response.data.order?.status || response.data?.status);
    } catch (error) {
      console.error("Fetch order error:", error);
      toast.error("Failed to load order details");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  // Fixed: Use PUT with order ID in URL
  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) {
      toast.success("Status is already set to " + selectedStatus);
      return;
    }

    try {
      setUpdatingStatus(true);
      // Correct endpoint: PUT /api/admin/orders/:id/status
      await api.put(`/orders/${id}/status`, {
        status: selectedStatus
      });
      
      toast.success(`Order status updated to ${selectedStatus}`);
      fetchOrder();
    } catch (error) {
      console.error("Update status error:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Fixed: Invoice download handler with correct endpoint
  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      // Use the correct invoice endpoint
      const response = await api.get(`/order/invoice/${id}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${id.slice(-8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error("Failed to download invoice. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/orders")}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Orders
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-1">
              Order #{order._id?.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Print Invoice
            </button>
            <button
              onClick={handleDownloadInvoice}
              disabled={downloading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Downloading...
                </>
              ) : (
                "Download Invoice"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Info & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Update */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h2>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleStatusUpdate}
                disabled={updatingStatus}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {updatingStatus ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>

          {/* Order Items with Product ID */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
              <span className="text-sm text-gray-500">
                Total: {order.cartItems?.length || 0} items
              </span>
            </div>
            <div className="divide-y divide-gray-200">
              {order.cartItems?.map((item, index) => {
                const productId = item.productId?._id || item.productId;
                const shortProductId = productId?.slice(-8).toUpperCase() || "N/A";
                
                return (
                  <div key={index} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg border"
                            onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg border flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                            ID: {shortProductId}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(productId || "");
                              toast.success("Product ID copied!");
                            }}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy full product ID"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                        </div>
                        
                        <p className="text-xs text-gray-400 mt-1 font-mono">
                          Full ID: {productId || "N/A"}
                        </p>
                        
                        <div className="flex gap-4 mt-2 text-sm">
                          <span>Quantity: <strong>{item.quantity}</strong></span>
                          <span>Price: <strong>₹{item.price}</strong></span>
                          <span>Total: <strong className="text-blue-600">₹{item.price * item.quantity}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Customer & Payment Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">
                  {order.userId?.name || order.userId?.email?.split('@')[0] || "Guest"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{order.userId?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{order.address?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-mono text-sm text-gray-600">{order.userId?._id || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">{order.address?.fullName}</p>
              <p className="text-gray-600">{order.address?.addressLine}</p>
              <p className="text-gray-600">
                {order.address?.city}, {order.address?.state} - {order.address?.pincode}
              </p>
              <p className="text-gray-600">Phone: {order.address?.phone}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₹{order.shipping?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹{order.tax?.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Discount</span>
                  <span className="text-green-600">-₹{order.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-blue-600 text-lg">₹{order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium text-gray-900">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              {order.razorpayPaymentId && (
                <div>
                  <p className="text-sm text-gray-500">Payment ID</p>
                  <p className="font-mono text-sm text-gray-600">{order.razorpayPaymentId}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {order.returnRequested && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-orange-800 mb-4">Return Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-orange-700">Return Status</p>
                  <p className="font-medium text-orange-900">
                    {order.status === "Return_requested" ? "Pending Approval" :
                     order.status === "Returned" ? "Approved & Refunded" :
                     order.status === "Return_rejected" ? "Rejected" : "Requested"}
                  </p>
                </div>
                {order.returnReason && (
                  <div>
                    <p className="text-sm text-orange-700">Return Reason</p>
                    <p className="text-orange-900">{order.returnReason}</p>
                  </div>
                )}
                {order.returnDescription && (
                  <div>
                    <p className="text-sm text-orange-700">Description</p>
                    <p className="text-orange-900">{order.returnDescription}</p>
                  </div>
                )}
                {order.returnRejectionReason && (
                  <div>
                    <p className="text-sm text-red-700">Rejection Reason</p>
                    <p className="text-red-900">{order.returnRejectionReason}</p>
                  </div>
                )}
                {order.refundAmount && (
                  <div>
                    <p className="text-sm text-green-700">Refund Amount</p>
                    <p className="font-semibold text-green-900">₹{order.refundAmount}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;