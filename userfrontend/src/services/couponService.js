import api from "../utils/api";

export const validateCoupon=(data)=>{
    return api.post("/coupon/validate",data);
};