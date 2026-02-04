import adminApi from "../utils/api";

export const getAllUsers = () => adminApi.get("/admin/users");

export const deleteUser = (id) =>
  adminApi.delete(`/admin/users/${id}`);
