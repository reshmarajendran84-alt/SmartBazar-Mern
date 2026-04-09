import api  from "../utils/api";

export const sendMessage =(message)=>
    api.post("/chat/message",{message});