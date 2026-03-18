// import axios from "axios";

// const api = "http://localhost:5000/api/cart";

// export const getCart = () =>
//   axios.get(api, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });

// export const addToCart = (data) =>
//   axios.post(`${api}/add`, data, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });

// export const updateCart = (data) =>
//   axios.put(`${api}/update`, data, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });

// export const removeFromCart = (productId) =>
//   axios.delete(`${api}/remove`, {
//     data: { productId },
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });