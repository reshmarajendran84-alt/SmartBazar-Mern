import { useState } from "react";

const ChatInput = ({ onSend, disabled }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const charsLeft = 500 - text.length;
  const isNearLimit = charsLeft <= 50;

  return (
    <div className="flex flex-col gap-1 p-3 border-t border-gray-100 bg-white flex-shrink-0">
      {text.length > 450 && (
        <div className="flex justify-end">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full ${
              charsLeft <= 20 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
            }`}
          >
            {charsLeft} chars left
          </span>
        </div>
      )}

      <div className="flex gap-2 items-end">
        <textarea
          value={text}
          maxLength={500}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder="Type your message... (Press Enter to send)"
          rows={Math.min(3, Math.ceil(text.length / 30) + 1)}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                     disabled:opacity-50 resize-none transition"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 
                     hover:from-indigo-700 hover:to-purple-700
                     disabled:from-gray-300 disabled:to-gray-300
                     text-white px-5 py-2 rounded-xl text-sm font-medium transition-all
                     disabled:cursor-not-allowed shadow-sm"
        >
          Send
        </button>
      </div>
      
      {/* Quick hint */}
      {!text && (
        <p className="text-[10px] text-gray-400 text-center">
          Try: "my orders" or "search laptop" or "cancel order [ID]"
        </p>
      )}
    </div>
  );
};

export default ChatInput;
