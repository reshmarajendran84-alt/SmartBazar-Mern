import api from "../utils/api";

export const getProducts=(page,category)=>
api.get(`/products?page=${page || 1}&category=${category || ""}`)

export const getProductById =(id)=>
    api.get(`/products/${id}`);