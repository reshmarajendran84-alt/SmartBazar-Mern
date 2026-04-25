import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnDescription, setReturnDescription] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);

  // Check if action=return in URL
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "return" && order && order.status === "Delivered" && !order.returnRequested) {
      setShowReturnModal(true);
    }
  }, [searchParams, order]);

  // Download Invoice Handler
  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
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
      
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Return Request Handler - User requests return (needs admin approval)
  const handleReturnRequest = async () => {
    if (!returnReason) {
      toast.error("Please select a reason for return");
      return;
    }

    try {
      setSubmittingReturn(true);
      // Call the return request endpoint (not direct return)
      const response = await api.post(`/return/request/${id}`, {
        reason: returnReason,
        description: returnDescription
      });
      
      if (response.data.success) {
        toast.success("Return request submitted successfully! Admin will review and approve/reject your request.");
        setShowReturnModal(false);
        fetchOrder(); // Refresh order details
      }
    } catch (error) {
      console.error('Error submitting return request:', error);
      toast.error(error.response?.data?.message || "Failed to submit return request. Please try again.");
    } finally {
      setSubmittingReturn(false);
    }
  };

  // Fetch order details
  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/order/${id}`);
      setOrder(response.data.order || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  // Cancel Order Handler
  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const response = await api.patch(`/order/cancel/${id}`);
      if (response.data.success) {
        toast.success("Order cancelled successfully!");
        fetchOrder(); // Refresh order details
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading order details...</div>;
  }

  if (!order) {
    return <div className="text-center py-8">Order not found</div>;
  }

  // Get return request status display
  const getReturnStatusDisplay = () => {
    if (!order.returnRequested) return null;
    
    if (order.status === 'Returned') {
      return { text: "Return Approved & Completed", color: "text-green-600", bg: "bg-green-50" };
    }
    if (order.status === 'Return_requested') {
      return { text: "Return Request Pending Approval", color: "text-yellow-600", bg: "bg-yellow-50" };
    }
    if (order.status === 'Return_rejected') {
      return { text: "Return Request Rejected", color: "text-red-600", bg: "bg-red-50" };
    }
    return null;
  };

  const returnStatus = getReturnStatusDisplay();

  return (
  <div className="min-h-screen bg-gray-100 py-6 px-3 md:px-6">

    <div className="max-w-6xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Order Details
        </h1>

        <button
          onClick={handleDownloadInvoice}
          disabled={downloading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
        >
          {downloading ? "Generating..." : "Download Invoice"}
        </button>
      </div>

      {/* RETURN STATUS */}
      {returnStatus && (
        <div className={`${returnStatus.bg} p-4 rounded-xl border`}>
          <p className={`font-semibold ${returnStatus.color}`}>
            {returnStatus.text}
          </p>
        </div>
      )}

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* ORDER INFO */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="font-semibold mb-4 text-gray-800">Order Info</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Order ID</p>
                <p className="font-semibold">
                  {order._id?.slice(-8).toUpperCase()}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-semibold">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Payment</p>
                <p className="font-semibold">{order.paymentMethod}</p>
              </div>

              <div>
                <p className="text-gray-500">Status</p>
                <span className={`px-2 py-1 rounded text-xs font-medium
                  ${order.status === "Delivered" ? "bg-green-100 text-green-700" :
                    order.status === "Cancelled" ? "bg-red-100 text-red-600" :
                    "bg-blue-100 text-blue-700"}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="font-semibold mb-3">Shipping Address</h2>
            <p className="font-medium">{order.address?.fullName}</p>
            <p className="text-sm text-gray-600">{order.address?.addressLine}</p>
            <p className="text-sm text-gray-600">
              {order.address?.city}, {order.address?.state} - {order.address?.pincode}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              📞 {order.address?.phone}
            </p>
          </div>

          {/* ITEMS */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="font-semibold mb-4">Order Items</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.cartItems?.map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3 flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <span>{item.name}</span>
                      </td>

                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">₹{item.price}</td>
                      <td className="p-3 text-right font-medium">
                        ₹{item.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE (SUMMARY) */}
        <div className="bg-white rounded-2xl shadow-md p-5 h-fit sticky top-6">

          <h2 className="font-semibold mb-4">Price Summary</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{order.shipping}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{order.tax}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{order.discount}</span>
              </div>
            )}

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-indigo-600">₹{order.total}</span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-5 space-y-3">

            {(order.status === "Pending" || order.status === "Confirmed") && (
              <button
                onClick={handleCancelOrder}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
              >
                Cancel Order
              </button>
            )}

            {order.status === "Delivered" && !order.returnRequested && (
              <button
                onClick={() => setShowReturnModal(true)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg"
              >
                Request Return
              </button>
            )}

          </div>
        </div>

      </div>
    </div>

    {/* MODAL */}
    {showReturnModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

          <h2 className="text-lg font-bold mb-4">Return Request</h2>

          <select
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          >
            <option value="">Select reason</option>
            <option value="damaged">Damaged</option>
            <option value="wrong_item">Wrong item</option>
            <option value="quality_issue">Quality issue</option>
          </select>

          <textarea
            value={returnDescription}
            onChange={(e) => setReturnDescription(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            placeholder="Describe issue..."
          />

          <div className="flex gap-3">
            <button
              onClick={handleReturnRequest}
              className="flex-1 bg-yellow-600 text-white py-2 rounded-lg"
            >
              Submit
            </button>

            <button
              onClick={() => setShowReturnModal(false)}
              className="flex-1 bg-gray-300 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    )}
  </div>
);
};

export default OrderDetailPage;