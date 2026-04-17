import api from "../utils/api";

// GET ALL PRODUCTS
export const getProducts = (page = 1, category = "",limit=100) =>
  api.get(`/products?page=${page}&limit=${limit}&category=${category}`);
export const getProductById = (id) =>  api.get(`/products/${id}`);
// DELETE PRODUCT
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// CREATE PRODUCT
export const createProduct = (data) =>
  api.post("/products", data,{
    headers:{
      "Content-Type":"multipart/form-data",
    },
  });

// UPDATE PRODUCT
export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data,{
    headers:{
      "Content-Type":"multipart/form-data",
    },
  });