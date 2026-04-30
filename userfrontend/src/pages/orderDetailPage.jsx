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
  const [selectedItem, setSelectedItem] = useState(null);
  const [processingItem, setProcessingItem] = useState(null);

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
      const response = await api.get(`/order/${id}/invoice`, {
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

  // Fetch order details
  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/order/${id}`);
      setOrder(response.data.order || response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  // Cancel Individual Item Handler
  const handleCancelItem = async (itemId, itemName) => {
    if (!confirm(`Are you sure you want to cancel "${itemName}"? Only this item will be cancelled.`)) return;
    
    try {
      setProcessingItem(itemId);
      const response = await api.put(`/order/${id}/item/${itemId}/cancel`);
      if (response.data.success) {
        toast.success(`${itemName} cancelled successfully!`);
        await fetchOrder();
      } else {
        toast.error(response.data.message || "Failed to cancel item");
      }
    } catch (error) {
      console.error('Error cancelling item:', error);
      toast.error(error.response?.data?.message || "Failed to cancel item");
    } finally {
      setProcessingItem(null);
    }
  };

  // Return Request Handler for Individual Item
  const handleReturnRequest = async () => {
    if (!returnReason) {
      toast.error("Please select a reason for return");
      return;
    }

    if (!selectedItem) {
      toast.error("No item selected for return");
      return;
    }

    try {
      setSubmittingReturn(true);
      const response = await api.post(`/returns/request/${id}`, {
        itemId: selectedItem._id || selectedItem.id,
        reason: returnReason,
        description: returnDescription
      });
      
      if (response.data.success) {
        toast.success(`Return request submitted for "${selectedItem.name}"!`);
        setShowReturnModal(false);
        setReturnReason("");
        setReturnDescription("");
        setSelectedItem(null);
        await fetchOrder();
      } else {
        toast.error(response.data.message || "Failed to submit return request");
      }
    } catch (error) {
      console.error('Error submitting return request:', error);
      toast.error(error.response?.data?.message || "Failed to submit return request");
    } finally {
      setSubmittingReturn(false);
    }
  };

  // Buy Single Item Again
  const handleBuyAgainItem = async (item) => {
    try {
      setProcessingItem(item._id || item.id);
      await api.post("/cart/add", {
        productId: item.productId,
        quantity: item.quantity,
        name: item.name,
        image: item.image,
        price: item.price
      });
      toast.success(`${item.name} added to cart!`);
      setTimeout(() => {
        window.location.href = "/cart";
      }, 1500);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setProcessingItem(null);
    }
  };

  // Open return modal for specific item
  const openReturnModalForItem = (item) => {
    setSelectedItem(item);
    setReturnReason("");
    setReturnDescription("");
    setShowReturnModal(true);
  };

  // Get item status display
  const getItemStatusBadge = (itemStatus) => {
    switch(itemStatus) {
      case 'Delivered': return "bg-green-100 text-green-700";
      case 'Cancelled': return "bg-red-100 text-red-600";
      case 'Returned': return "bg-purple-100 text-purple-700";
      case 'Return_requested': return "bg-yellow-100 text-yellow-700";
      case 'Return_rejected': return "bg-orange-100 text-orange-700";
      case 'Shipped': return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Order not found</p>
          <button 
            onClick={() => window.location.href = '/my-orders'}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const showCancelButton = order.status === "Pending" || order.status === "Confirmed";

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
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              "📄 Download Invoice"
            )}
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* ORDER INFO */}
            <div className="bg-white rounded-2xl shadow-md p-5">
              <h2 className="font-semibold mb-4 text-gray-800">📋 Order Info</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Order ID</p>
                  <p className="font-semibold font-mono">
                    #{order._id?.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-semibold">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Payment</p>
                  <p className="font-semibold">
                    {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 
                     order.paymentMethod === 'ONLINE' ? 'Online Payment' : 
                     order.paymentMethod === 'WALLET' ? 'Wallet' : order.paymentMethod}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Status</p>
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* SHIPPING ADDRESS */}
            <div className="bg-white rounded-2xl shadow-md p-5">
              <h2 className="font-semibold mb-3">📦 Shipping Address</h2>
              {order.address ? (
                <>
                  <p className="font-medium">{order.address.fullName}</p>
                  <p className="text-sm text-gray-600">{order.address.addressLine}</p>
                  <p className="text-sm text-gray-600">
                    {order.address.city}, {order.address.state} - {order.address.pincode}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    📞 {order.address.phone}
                  </p>
                </>
              ) : (
                <p className="text-gray-500">No address available</p>
              )}
            </div>

            {/* ORDER ITEMS TABLE - WITH INDIVIDUAL ACTIONS */}
            <div className="bg-white rounded-2xl shadow-md p-5">
              <h2 className="font-semibold mb-4">🛍️ Order Items</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Total</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.cartItems?.map((item, i) => {
                      const itemStatus = item.itemStatus || order.status;
                      const isCancelled = itemStatus === 'Cancelled';
                      const isReturnRequested = itemStatus === 'Return_requested';
                      const isReturned = itemStatus === 'Returned';
                      const canCancelItem = (itemStatus === 'Pending' || itemStatus === 'Confirmed') && !isCancelled;
                      const canReturnItem = itemStatus === 'Delivered' && !item.returnRequested && !isReturnRequested && !isReturned;
                      
                      return (
                        <tr key={i} className="border-t hover:bg-gray-50">
                          {/* Product */}
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 rounded object-cover"
                                  onError={(e) => {
                                    e.target.src = '/placeholder.jpg';
                                  }}
                                />
                              )}
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </td>
                          
                          {/* Quantity */}
                          <td className="p-3 text-center">{item.quantity}</td>
                          
                          {/* Price */}
                          <td className="p-3 text-right">₹{item.price.toLocaleString()}</td>
                          
                          {/* Total */}
                          <td className="p-3 text-right font-medium">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </td>
                          
                          {/* Item Status */}
                          <td className="p-3 text-center">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getItemStatusBadge(itemStatus)}`}>
                              {itemStatus}
                            </span>
                            {isReturnRequested && (
                              <p className="text-xs text-yellow-600 mt-1">Pending Approval</p>
                            )}
                          </td>
                          
                          {/* Actions */}
                          <td className="p-3 text-center">
                            <div className="flex flex-col gap-2">
                              {canCancelItem && (
                                <button
                                  onClick={() => handleCancelItem(item._id || i, item.name)}
                                  disabled={processingItem === (item._id || i)}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition disabled:opacity-50 whitespace-nowrap"
                                >
                                  {processingItem === (item._id || i) ? "..." : "❌ Cancel"}
                                </button>
                              )}
                              
                              {canReturnItem && (
                                <button
                                  onClick={() => openReturnModalForItem(item)}
                                  className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs font-medium transition whitespace-nowrap"
                                >
                                  🔄 Return
                                </button>
                              )}
                              
                              {itemStatus === 'Delivered' && (
                                <button
                                  onClick={() => handleBuyAgainItem(item)}
                                  disabled={processingItem === (item._id || i)}
                                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition disabled:opacity-50 whitespace-nowrap"
                                >
                                  {processingItem === (item._id || i) ? "..." : "🛒 Buy Again"}
                                </button>
                              )}
                              
                              {isCancelled && (
                                <span className="text-xs text-red-500">Cancelled</span>
                              )}
                              
                              {isReturned && (
                                <span className="text-xs text-green-500">Returned</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (SUMMARY & ACTIONS) */}
          <div className="space-y-6">
            
            {/* PRICE SUMMARY */}
            <div className="bg-white rounded-2xl shadow-md p-5">
              <h2 className="font-semibold mb-4">💰 Price Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{order.subtotal?.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>₹{order.shipping?.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>₹{order.tax?.toLocaleString()}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount?.toLocaleString()}</span>
                  </div>
                )}

                <hr className="my-2" />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-indigo-600">₹{order.total?.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Info */}
              {order.razorpayPaymentId && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">Payment ID:</p>
                  <p className="text-xs font-mono text-gray-600 break-all">{order.razorpayPaymentId}</p>
                </div>
              )}
            </div>

            {/* ORDER LEVEL ACTIONS */}
            <div className="bg-white rounded-2xl shadow-md p-5">
              <h2 className="font-semibold mb-4">⚡ Order Actions</h2>
              
              <div className="space-y-3">
                {showCancelButton && (
                  <button
                    onClick={async () => {
                      if (confirm("Cancel entire order? All items will be cancelled.")) {
                        try {
                          const response = await api.put(`/order/${id}/cancel`);
                          if (response.data.success) {
                            toast.success("Order cancelled successfully!");
                            await fetchOrder();
                          }
                        } catch (error) {
                          toast.error("Failed to cancel order");
                        }
                      }
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition"
                  >
                    ❌ Cancel Entire Order
                  </button>
                )}

                {order.status === "Delivered" && (
                  <button
                    onClick={async () => {
                      toast.info("Adding all items to cart...");
                      for (const item of order.cartItems) {
                        if (item.itemStatus !== 'Cancelled') {
                          await api.post("/cart/add", {
                            productId: item.productId,
                            quantity: item.quantity,
                            name: item.name,
                            image: item.image,
                            price: item.price
                          });
                        }
                      }
                      toast.success("Items added to cart!");
                      setTimeout(() => {
                        window.location.href = "/cart";
                      }, 1500);
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition"
                  >
                    🛒 Buy All Again
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RETURN REQUEST MODAL */}
      {showReturnModal && selectedItem && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowReturnModal(false);
              setSelectedItem(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Return Item</h2>
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setSelectedItem(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Selected Item Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold">{selectedItem.name}</p>
              <p className="text-sm text-gray-600">Quantity: {selectedItem.quantity}</p>
              <p className="text-sm text-gray-600">Price: ₹{(selectedItem.price * selectedItem.quantity).toLocaleString()}</p>
            </div>

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
                <option value="size_issue">Size/fit issue</option>
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
                placeholder="Please provide additional details..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setSelectedItem(null);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium transition"
                disabled={submittingReturn}
              >
                Cancel
              </button>
              <button
                onClick={handleReturnRequest}
                disabled={submittingReturn || !returnReason}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50"
              >
                {submittingReturn ? "Submitting..." : "Submit Return"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;