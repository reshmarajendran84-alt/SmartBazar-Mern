import api from "../utils/api";

export const getProfile = () => api.get("/user/profile");
export const updateProfile = (data) => api.put("/user/profile", data);

export const getAddresses = () => api.get("/user/address");
export const addAddress = (data) => api.post("/user/address", data);

export const deleteAddress = (id) =>
  api.delete(`/user/address/${id}`);

export const setDefaultAddress = (id) =>
  api.patch(`/user/address/${id}/default`);
