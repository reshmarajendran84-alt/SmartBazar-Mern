import api from "../utils/api";

export const createCoupon = (data) => api.post("/coupon", data);
export const getCoupons = () => api.get("/coupon");
export const updateCoupon = (id, data) => api.put(`/coupon/${id}`, data);
export const deleteCoupon = (id) => api.delete(`/coupon/${id}`);