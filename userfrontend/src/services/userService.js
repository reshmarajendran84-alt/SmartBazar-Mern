import api from "../utils/api"; // your axios instance

export const getUserProfile = async () => {
  return await api.get("/user/profile"); // adjust endpoint if needed
};