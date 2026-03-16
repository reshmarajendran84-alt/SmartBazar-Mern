import api from "../utils/api";

export const getProducts = (page = 1, category = "", search = "", sort = "") =>
  api.get(
    `/products?page=${page}&category=${category}&search=${search}&sort=${sort}`
  );
// export const getProducts = (page,category,search,sort) => {

// return api.get("/products",{
// params:{
// page,
// category,
// search,
// sort
// }
// });

// };

export const getProductById = (id) =>
  api.get(`/products/${id}`);