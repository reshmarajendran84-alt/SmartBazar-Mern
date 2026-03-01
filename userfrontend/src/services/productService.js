import api from "../utils/api";

export const fetchProducts=(page,category)=>
    api.get(`/product?page=${page}&category=${category}`);

export const fetchSingleProduct =(id)=>
    api.get(`/product/${id}`);