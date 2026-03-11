import api from "../utils/api";

// export const getProducts = (
//   page,
//   category = "",
//   price = "",
//   sort = "",
//   search = ""
// ) =>
//   api.get(
//     `/products?page=${page || 1}&category=${category || ""}&price=${price || ""}&sort=${sort || ""}&search=${search || ""}`
//   );

export const getProducts = (page,category,search,sort) => {

return api.get("/products",{
params:{
page,
category,
search,
sort
}
});

};

export const getProductById = (id) =>
  api.get(`/products/${id}`);