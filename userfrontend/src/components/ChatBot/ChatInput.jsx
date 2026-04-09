// user-frontend/src/components/ChatBot/ChatInput.jsx
import { useState } from "react";

const ChatInput = ({ onSend, disabled }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text);      // send to parent
    setText("");        // clear input
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSend(); // Enter key sends
  };

  return (
    <div className="flex gap-2 p-3 border-t border-gray-100">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
        placeholder="Type a message..."
        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-400
                   disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300
                   text-white px-4 py-2 rounded-xl text-sm font-medium transition"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;