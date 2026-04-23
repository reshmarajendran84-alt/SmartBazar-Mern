import api from "../utils/api";

export const fetchAllOrders     = (params)        => api.get(`/orders?${params}`);
export const fetchOrderStats    = ()              => api.get("/orders/stats");
export const fetchOrderById     = (id)            => api.get(`/orders/${id}`);
export const changeOrderStatus  = (id, status)    => api.put(`/orders/${id}/status`, { status });


export const approveReturn =(orderId) =>api.post(`/orders/${orderId}/approve-return`);
export const rejectionReason=(orderId,rejectionReason)=>api.post(`/orders/${orderId}/reject-return`,{rejectionReason});