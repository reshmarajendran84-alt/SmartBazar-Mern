import { useState } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import { sendMessage } from "../../services/chatService";

const WELCOME = {
  role: "bot",
  text: "Hi! 👋 I'm SmartBazar Assistant.\n\nI can help you with:\n• 📋 My orders\n• ❌ Cancel order <ID>\n• 🔄 Return / Refund\n• 🚚 Delivery info\n• 💳 Payment methods\n• 🎉 Current offers\n• 👤 Talk to agent\n• 🔍 Search products",
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

// Quick replies mapping 1-to-1 with ChatService.js routes
const quickReplies = [
  { label: "👋 Hi", message: "hi" },
  { label: "📋 My Orders", message: "my orders" },
  { label: "❌ Cancel Order", message: "cancel order", requiresId: true },
  { label: "🔄 Return Item", message: "return item" },
  { label: "🚚 Delivery Info", message: "delivery info" },
  { label: "💳 Payment", message: "payment methods" },
  { label: "🎉 Offers", message: "current offers" },
  { label: "👤 Talk to Agent", message: "talk to agent" },
  { label: "🔍 Search", message: "search", requiresSearch: true },
  { label: "😊 Goodbye", message: "thanks bye" },
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMsg] = useState([WELCOME]);
  const [loading, setLoading] = useState(false);
  
  // State for dynamic inputs
  const [showOrderIdInput, setShowOrderIdInput] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ChatBot.jsx - Updated handleSend function
const handleSend = async (text) => {
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const userMsg = { role: "user", text, time };
  setMsg(prev => [...prev, userMsg]);
  setLoading(true);

  try {
    const res = await sendMessage(text);
    console.log("API Response:", res); // Debug log
    
    const reply = res.data?.reply || "Sorry, I didn't get a proper response.";
    setMsg(prev => [...prev, { 
      role: "bot", 
      text: reply, 
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }]);
  } catch (error) {
    console.error("Full error:", error);
    console.error("Error response:", error.response);
    
    // Better error message based on error type
    let errorMsg = "❌ Sorry, I'm having trouble connecting. Please try again.";
    
    if (error.response?.status === 401) {
      errorMsg = "🔒 Please login to use this feature.";
    } else if (error.response?.status === 500) {
      errorMsg = "⚠️ Server error. Please try again later.";
    } else if (error.code === 'ECONNABORTED') {
      errorMsg = "⏰ Request timeout. Please check your connection.";
    }
    
    setMsg(prev => [...prev, { 
      role: "bot", 
      text: errorMsg, 
      time 
    }]);
  } finally {
    setLoading(false);
  }
};
  const handleQuickReply = (message) => {
    handleSend(message);
  };

  const handleCancelOrder = () => {
    if (orderId.trim()) {
      handleSend(`cancel order ${orderId.trim()}`);
      setOrderId("");
      setShowOrderIdInput(false);
    }
  };

  const handleSearchProduct = () => {
    if (searchTerm.trim()) {
      handleSend(`search ${searchTerm.trim()}`);
      setSearchTerm("");
      setShowSearchInput(false);
    }
  };

  return (
    <>
      {/* CHAT POPUP */}
      {open && (
        <div className="fixed bottom-20 right-4 w-80 sm:w-96 h-[550px]
                        bg-white rounded-2xl shadow-2xl border border-gray-200
                        flex flex-col z-50 overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3
                          bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <p className="text-sm font-semibold">SmartBazar Assistant</p>
                <p className="text-xs text-indigo-200">Online • Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-indigo-200 text-xl leading-none transition"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <ChatWindow messages={messages} loading={loading} />

          {/* Quick Reply Section */}
          <div className="flex flex-wrap gap-1.5 px-3 py-2 border-t border-gray-100 bg-gray-50">
            {quickReplies.map((reply, idx) => {
              // Cancel Order with ID input
              if (reply.requiresId) {
                return (
                  <div key={idx}>
                    {!showOrderIdInput ? (
                      <button
                        onClick={() => setShowOrderIdInput(true)}
                        disabled={loading}
                        className="text-xs px-3 py-1.5 rounded-full border border-red-400
                                   text-red-600 hover:bg-red-50 disabled:opacity-40 transition"
                      >
                        {reply.label}
                      </button>
                    ) : (
                      <div className="flex gap-1 items-center">
                        <input
                          type="text"
                          placeholder="Order ID"
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          className="text-xs px-2 py-1 border rounded-full w-28 focus:outline-none focus:ring-1 focus:ring-red-400"
                          autoFocus
                        />
                        <button
                          onClick={handleCancelOrder}
                          className="text-xs px-2 py-1 bg-red-500 text-white rounded-full"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setShowOrderIdInput(false)}
                          className="text-xs px-2 py-1 bg-gray-300 rounded-full"
                        >
                          ✗
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              // Search with input
              if (reply.requiresSearch) {
                return (
                  <div key={idx}>
                    {!showSearchInput ? (
                      <button
                        onClick={() => setShowSearchInput(true)}
                        disabled={loading}
                        className="text-xs px-3 py-1.5 rounded-full border border-green-400
                                   text-green-600 hover:bg-green-50 disabled:opacity-40 transition"
                      >
                        {reply.label}
                      </button>
                    ) : (
                      <div className="flex gap-1 items-center">
                        <input
                          type="text"
                          placeholder="Product name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="text-xs px-2 py-1 border rounded-full w-32 focus:outline-none focus:ring-1 focus:ring-green-400"
                          autoFocus
                          onKeyPress={(e) => e.key === 'Enter' && handleSearchProduct()}
                        />
                        <button
                          onClick={handleSearchProduct}
                          className="text-xs px-2 py-1 bg-green-500 text-white rounded-full"
                        >
                          🔍
                        </button>
                        <button
                          onClick={() => setShowSearchInput(false)}
                          className="text-xs px-2 py-1 bg-gray-300 rounded-full"
                        >
                          ✗
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              // Regular quick replies
              return (
                <button
                  key={idx}
                  onClick={() => handleQuickReply(reply.message)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-full border border-indigo-400
                             text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 transition"
                >
                  {reply.label}
                </button>
              );
            })}
          </div>

          {/* Input */}
          <ChatInput onSend={handleSend} disabled={loading} />
        </div>
      )}

      {/* Notification Badge */}
      {!open && messages.filter(m => m.role === 'bot' && !m.seen).length > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500
                       rounded-full text-white text-xs flex items-center justify-center animate-pulse">
          {messages.filter(m => m.role === 'bot').length}
        </span>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600
                   hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-lg 
                   flex items-center justify-center text-2xl z-50 transition-all hover:scale-110"
        title="Chat with us"
      >
        {open ? "✕" : "💬"}
      </button>
    </>
  );
};

export default ChatBot;