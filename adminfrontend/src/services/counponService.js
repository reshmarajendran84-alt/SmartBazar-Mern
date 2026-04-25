import api from "../utils/api";

export const createCoupon = (data) => api.post("/coupons", data);
export const getCoupons = () => api.get("/coupons");
export const updateCoupon = (id, data) => api.put(`/coupons/${id}`, data);
export const deleteCoupon = (id) => api.delete(`/coupons/${id}`);