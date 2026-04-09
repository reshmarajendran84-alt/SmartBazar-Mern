// admin-frontend/src/services/reviewService.js
import api from "../utils/api";

// GET /api/admin/reviews?status=pending
export const getAllReviews  = (status = "") =>
  api.get(`/reviews${status ? `?status=${status}` : ""}`);

// PATCH /api/admin/reviews/:id/status
export const updateReviewStatus = (id, status) =>
  api.patch(`/reviews/${id}/status`, { status });

export const deleteReview = (id) => api.delete(`/reviews/${id}`);