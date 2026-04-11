import chatService from "../services/chatService.js"

class ChatController {
  async sendMessage(req, res) {
    try {
      const { message, aiMode } = req.body

      // Validate first — before anything else
      if (!message) {
        return res.status(400).json({ reply: "Please provide a message." })
      }

      // Security check — must be BEFORE processing
      if (message.length > 500) {
        return res.status(400).json({ reply: "Message too long. Please keep it under 500 characters." })
      }

      console.log("📨 Message received:", message)
      console.log("👤 User ID:", req.user?._id)
      console.log("🤖 AI Mode:", aiMode)

      const userId = req.user?._id ?? null
      const reply = await chatService.getReply(message.trim(), userId, aiMode)

      console.log("🤖 Reply sent:", reply.substring(0, 100))

      res.status(200).json({ reply })

    } catch (err) {
      console.error("❌ Chat error:", err)
      res.status(500).json({ reply: "Sorry, something went wrong. Please try again later." })
    }
  }
}

export default new ChatController()