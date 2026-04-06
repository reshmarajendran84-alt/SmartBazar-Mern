import api from "../utils/api";

export const fetchAllOrders     = (params)        => api.get(`/orders?${params}`);
export const fetchOrderStats    = ()              => api.get("/orders/stats");
export const fetchOrderById     = (id)            => api.get(`/orders/${id}`);
export const changeOrderStatus  = (id, status)    => api.put(`/orders/${id}/status`, { status });