import api from "../utils/api";

export const submitReview    = (data)      => api.post("/reviews", data).then(r => r.data.data);
export const getProductReviews = (productId) => api.get(`/reviews/product/${productId}`).then(r => r.data.data);
export const getUserReview   = (productId) => api.get(`/reviews/my/${productId}`).then(r => r.data.data);