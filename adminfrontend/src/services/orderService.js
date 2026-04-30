import api from "../utils/api";

// Existing functions...
export const placeCODOrder = (data) => api.post("/order", data);
export const createRazorpayOrder = (data) => api.post("/order/create-razorpay-order", data);
export const verifyPayment = (data) => api.post("/order/verify-payment", data);
export const placeWalletOrder = (data) => api.post("/order/wallet-order", data);
export const getUserOrders = () => api.get("/order/my-orders").then((r) => r.data.orders);

// Add these new functions for returns:
export const requestReturn = (orderId, data) => api.post(`/returns/request/${orderId}`, data);
export const getReturnRequests = (status) => api.get(`/returns${status ? `?status=${status}` : ''}`);
export const approveReturn = (orderId) => api.post(`/returns/${orderId}/approve`);
export const rejectReturn = (orderId, rejectionReason) => api.post(`/returns/${orderId}/reject`, { rejectionReason });
export const getUserReturns = () => api.get("/returns/my-returns");

export default {
  placeCODOrder,
  createRazorpayOrder,
  verifyPayment,
  placeWalletOrder,
  getUserOrders,
  requestReturn,
  getReturnRequests,
  approveReturn,
  rejectReturn,
  getUserReturns,
};