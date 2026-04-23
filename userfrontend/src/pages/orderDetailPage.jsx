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
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with Download Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <button
          onClick={handleDownloadInvoice}
          disabled={downloading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
        >
          {downloading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Invoice
            </>
          )}
        </button>
      </div>

      {/* Return Status Banner */}
      {returnStatus && (
        <div className={`${returnStatus.bg} p-4 rounded-lg mb-6 border`}>
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${returnStatus.color}`}>
              {returnStatus.text}
            </span>
            {order.status === 'Return_requested' && (
              <span className="text-sm text-gray-500 ml-2">
                - Awaiting admin approval
              </span>
            )}
            {order.status === 'Return_rejected' && order.returnRejectionReason && (
              <span className="text-sm text-gray-500 ml-2">
                Reason: {order.returnRejectionReason}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Order Info */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-semibold">{order._id?.slice(-8).toUpperCase()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Order Date</p>
            <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-semibold">{order.paymentMethod}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Order Status</p>
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
              order.status === 'Returned' ? 'bg-green-100 text-green-800' :
              order.status === 'Return_requested' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'Return_rejected' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {order.status === 'Return_requested' ? 'Return Requested' : 
               order.status === 'Return_rejected' ? 'Return Rejected' : 
               order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p>{order.address?.fullName}</p>
          <p>{order.address?.addressLine}</p>
          <p>{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
          <p>Phone: {order.address?.phone}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-semibold">Product</th>
                <th className="p-3 text-right text-sm font-semibold">Quantity</th>
                <th className="p-3 text-right text-sm font-semibold">Price</th>
                <th className="p-3 text-right text-sm font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.cartItems?.map((item, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      )}
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">{item.quantity}</td>
                  <td className="p-3 text-right">₹{item.price}</td>
                  <td className="p-3 text-right">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-gray-300">
              <tr>
                <td colSpan="3" className="p-3 text-right font-semibold">Subtotal</td>
                <td className="p-3 text-right">₹{order.subtotal}</td>
              </tr>
              <tr>
                <td colSpan="3" className="p-3 text-right font-semibold">Shipping</td>
                <td className="p-3 text-right">₹{order.shipping}</td>
              </tr>
              <tr>
                <td colSpan="3" className="p-3 text-right font-semibold">Tax</td>
                <td className="p-3 text-right">₹{order.tax}</td>
              </tr>
              {order.discount > 0 && (
                <tr>
                  <td colSpan="3" className="p-3 text-right font-semibold">Discount</td>
                  <td className="p-3 text-right text-red-600">-₹{order.discount}</td>
                </tr>
              )}
              <tr className="text-lg">
                <td colSpan="3" className="p-3 text-right font-bold">Grand Total</td>
                <td className="p-3 text-right font-bold">₹{order.total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {(order.status === 'Pending' || order.status === 'Confirmed') && (
          <button
            onClick={handleCancelOrder}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Cancel Order
          </button>
        )}
        
        {order.status === 'Delivered' && !order.returnRequested && (
          <button
            onClick={() => setShowReturnModal(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
          >
            Request Return
          </button>
        )}

        {(order.status === 'Return_requested') && (
          <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-md">
            Return request pending admin approval
          </div>
        )}
      </div>

      {/* Return Request Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Request Return</h2>
            <p className="text-gray-600 mb-4">
              Please provide details for your return request. Admin will review and approve/reject your request.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Reason for return *</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full border rounded-md p-2"
                required
              >
                <option value="">Select a reason</option>
                <option value="damaged">Product damaged</option>
                <option value="wrong_item">Wrong item received</option>
                <option value="size_issue">Size issue</option>
                <option value="quality_issue">Quality issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description (optional)</label>
              <textarea
                value={returnDescription}
                onChange={(e) => setReturnDescription(e.target.value)}
                className="w-full border rounded-md p-2"
                rows="3"
                placeholder="Please provide more details about the issue..."
              />
            </div>
            
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Once approved, refund will be credited to your wallet within 5-7 business days.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleReturnRequest}
                disabled={submittingReturn || !returnReason}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReturn ? "Submitting..." : "Submit Return Request"}
              </button>
              <button
                onClick={() => setShowReturnModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-md"
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