import api  from "../utils/api";

export const sendMessage =(message,aiMode= false)=>
    api.post("/chat/message",{message,aiMode});