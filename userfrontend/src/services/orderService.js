import api from "../utils/api";

//  Orders
export const placeCODOrder = (data) => api.post("/order", data);
export const createRazorpayOrder = (data) =>
  api.post("/order/create-razorpay-order", data);
export const verifyPayment = (data) =>
  api.post("/order/verify-payment", data);
export const placeWalletOrder = (data) =>
  api.post("/order/wallet-order", data);

//  Get Orders
export const getUserOrders = () =>
  api.get("/order/my-orders").then((r) => r.data.orders);

// Default export
export default {
  placeCODOrder,
  createRazorpayOrder,
  verifyPayment,
  placeWalletOrder,
};