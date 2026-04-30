import api from "../utils/api";

export const getProducts = ({ page = 1, category = "", search = "", sort = "", price = "", rating = "" } = {}) => {
  const params = new URLSearchParams();
  params.set("page", page);
  if (category) params.set("category", category);
  if (search)   params.set("search", search);
  if (sort)     params.set("sort", sort);
  if (price && Number(price) < 200000) params.set("price", price);
  if (rating && Number(rating) > 0)   params.set("rating", rating);
  return api.get(`/products?${params.toString()}`);
};

export const getProductById = (id) => api.get(`/products/${id}`);