import api from "../utils/api";

export const submitReview    = (data)      => api.post("/api/reviews", data).then(r => r.data.data);
export const getProductReviews = (productId) => api.get(`/api/reviews/product/${productId}`).then(r => r.data.data);
export const getUserReview   = (productId) => api.get(`/api/reviews/my/${productId}`).then(r => r.data.data);