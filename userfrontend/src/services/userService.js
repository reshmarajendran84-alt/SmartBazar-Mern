import api from "../utils/api"; 

export const getUserProfile = async () => {
  return await api.get("/user/profile"); 
};