import axios from "axios";
const api =axios.create({
    baseURL:"http://localhost:5000/api",
});

api.interceptors.request.use((request)=>{
    const token =localStorage.getItem("token");
    if(token){
        require.headers.Authorization =`Bearer ${token}`;
    }
    return request;
});
export default api;