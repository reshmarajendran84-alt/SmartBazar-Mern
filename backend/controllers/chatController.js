// import chatService from "../services/chatService.js";
// import ChatService from "../services/chatService.js";

// class ChatController {
//  async sendMessage(req, res) {
//   try {
//     const { message } = req.body;

//     if (message.toLowerCase() === "test") {
//       return res.status(200).json({ reply: "NEW CODE IS RUNNING ✅" });
//     }

//     const userId = req.user?._id ?? null;
//     const reply  = await ChatService.getReply(message.trim(), userId);
//     res.status(200).json({ reply });

//   } catch (err) {
//     console.error("Chat error:", err);
//     res.status(500).json({ reply: "Sorry, something went wrong." });
//   }
// }
// async getReply (req,res) {
//   try{
//     const {message} =req.body;
//     const userId =req.user?._id;

//     console.log("controller hit :",message,"USER:", userId);
//     const reply =await chatService.getReply(message,userId);
//     res.json({reply});
//   }catch(err){
//     console.error("controller error:",err);
//     res.status(500).json({reply:"Server Error"});
//   }
// }
// }

// export default new ChatController();


// controllers/chatController.js
import chatService from "../services/chatService.js";

class ChatController {
  async sendMessage(req, res) {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ reply: "Please provide a message." });
      }

      // Debug log
      console.log("📨 Message received:", message);
      console.log("👤 User ID:", req.user?._id);

      const userId = req.user?._id ?? null;
      const reply = await chatService.getReply(message.trim(), userId);
      
      console.log("🤖 Reply sent:", reply.substring(0, 100));
      
      res.status(200).json({ reply });
    } catch (err) {
      console.error("❌ Chat error:", err);
      res.status(500).json({ reply: "Sorry, something went wrong. Please try again later." });
    }
  }
}

export default new ChatController();