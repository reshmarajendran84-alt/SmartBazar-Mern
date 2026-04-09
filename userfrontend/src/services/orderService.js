import api from "../utils/api";

export const placeCODOrder = (data) => api.post("/order/cod", data);
export const createRazorpayOrder = (data) => api.post("/order/razorpay-order", data);
export const verifyPayment = (data) => api.post("/order/verify", data);


export const placeWalletOrder = (data) => api.post("/order/wallet", data);

export const getUserOrders = () =>
  api.get("/order/my-orders").then(r => {
    console.log("ORDERS RECEIVED:", r.data);
    return r.data.orders;  
  });



export default { placeCODOrder, createRazorpayOrder, verifyPayment ,placeWalletOrder};