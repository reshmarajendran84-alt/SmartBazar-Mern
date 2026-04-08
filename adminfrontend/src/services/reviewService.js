import api from "../utils/api";

export const getAllReviews = () => api.get("/reviews/all");

export const deleteReview = (id) => api.delete(`/reviews/${id}`);