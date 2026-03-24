// // services/orderService.js
// import api from "../utils/api";

// export const createOrder = (orderData) => api.post("/order/create-order", orderData);
// export const cancelOrder = (orderId) => api.post(`/order/cancel/${orderId}`);
// export const verifyPayment = (paymentData) => api.post("/order/verify", paymentData);
// export const getWallet = () => api.get("/wallet");  
import api from "../utils/api";

export const placeCODOrder = (data) => api.post("/order/cod", data);
export const createRazorpayOrder = (data) => api.post("/order/razorpay-order", data);
export const verifyPayment = (data) => api.post("/order/verify", data);

export default { placeCODOrder, createRazorpayOrder, verifyPayment };