import api from "../utils/api";

export const getCategories = () => api.get("/categories");
export const createCategory = (data) => api.post("/categories", data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const toggleCategoryStatus = (id) => api.patch(`/categories/${id}/toggle-status`); 