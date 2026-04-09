// user-frontend/src/components/ChatBot/ChatBot.jsx
import { useState } from "react";
import ChatWindow  from "./ChatWindow";
import ChatInput   from "./ChatInput";
import { sendMessage } from "../../services/chatService";

const WELCOME = {
  role: "bot",
  text: "Hi! 👋 I'm SmartBazar Assistant.\n\nI can help you with:\n• My orders\n• Order <ID> — check status\n• Search <product name>",
};

const ChatBot = () => {
  const [open, setOpen]       = useState(false);       // popup open or closed
  const [messages, setMsg]    = useState([WELCOME]);   // chat history
  const [loading, setLoading] = useState(false);       // bot is typing

  const handleSend = async (text) => {
    // 1. Add user message to chat immediately
    const userMsg = { role: "user", text };
    setMsg(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // 2. Call backend
      const res   = await sendMessage(text);
      const reply = res.data.reply;

      // 3. Add bot reply to chat
      setMsg(prev => [...prev, { role: "bot", text: reply }]);
    } catch {
      setMsg(prev => [...prev, { role: "bot", text: "❌ Sorry, I'm having trouble connecting. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── CHAT POPUP ── */}
      {open && (
        <div className="fixed bottom-20 right-4 w-80 sm:w-96 h-[500px]
                        bg-white rounded-2xl shadow-2xl border border-gray-200
                        flex flex-col z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3
                          bg-indigo-600 text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <p className="text-sm font-semibold">SmartBazar Assistant</p>
                <p className="text-xs text-indigo-200">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-indigo-200 text-xl leading-none"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <ChatWindow messages={messages} loading={loading} />

          {/* Input */}
          <ChatInput onSend={handleSend} disabled={loading} />
        </div>
      )}

      {/* ── TOGGLE BUTTON ── */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-indigo-600 hover:bg-indigo-700
                   text-white rounded-full shadow-lg flex items-center justify-center
                   text-2xl z-50 transition-transform hover:scale-110"
        title="Chat with us"
      >
        {open ? "✕" : "💬"}
      </button>
    </>
  );
};

export default ChatBot;