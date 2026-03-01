import api from "../utils/api";

export const getCategories = () => api.get("/admin/categories");
export const createCategory = (data) => api.post("/admin/categories", data);
export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`);