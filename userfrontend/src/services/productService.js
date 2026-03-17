import api from "../utils/api";

export const getProducts = (page = 1, category = "", search = "", sort = "") =>
  api.get(
    `/products?page=${page}&category=${category}&search=${search}&sort=${sort}`
  );
export const getProductById = (id) =>
  api.get(`/products/${id}`);