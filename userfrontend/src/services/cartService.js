import api from "../utils/api";

export const addToCart = (data) => api.post("/cart/add", data);
export const getCart = () => api.get("/cart");
export const updateCart = (data) => api.put("/cart/update", data);
export const removeFromCart = (productId) =>
  api.delete("/cart/remove", { data: { productId } });