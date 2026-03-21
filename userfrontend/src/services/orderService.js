import api from "../utils/api";

export const createOrder = (orderData) => api.post("/order/create-order", orderData);
export const verifyPayment = (paymentData) => api.post("/order/verify", paymentData);