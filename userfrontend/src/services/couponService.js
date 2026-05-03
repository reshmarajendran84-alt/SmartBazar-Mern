import api from "../utils/api";

export const validateCoupon=(data)=>{
    return api.post("/coupon/validate",data);
};

export const getAllCoupons = () => api.get("/coupon/active");  // add this
