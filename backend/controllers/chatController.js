import ChatService from "../services/chatService.js";

class ChatController {
 async sendMessage(req, res) {
  try {
    const { message } = req.body;

    // ✅ TEMPORARY TEST — remove after confirm
    if (message.toLowerCase() === "test") {
      return res.status(200).json({ reply: "NEW CODE IS RUNNING ✅" });
    }

    const userId = req.user?._id ?? null;
    const reply  = await ChatService.getReply(message.trim(), userId);
    res.status(200).json({ reply });

  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
}
}

export default new ChatController();