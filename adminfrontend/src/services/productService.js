import api from "../utils/api";

// GET ALL PRODUCTS
export const getProducts = () => api.get("/admin/products");
export const getProductById = (id) =>
  api.get(`/admin/products/${id}`);
// DELETE PRODUCT
export const deleteProduct = (id) =>
  api.delete(`/admin/products/${id}`);

// CREATE PRODUCT
export const createProduct = (data) =>
  api.post("/admin/products", data);

// UPDATE PRODUCT
export const updateProduct = (id, data) =>
  api.put(`/admin/products/${id}`, data);