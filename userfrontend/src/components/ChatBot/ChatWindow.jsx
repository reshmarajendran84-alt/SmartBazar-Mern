// user-frontend/src/components/ChatBot/ChatWindow.jsx
import { useEffect, useRef } from "react";

// Each message is: { role: "user" | "bot", text: "..." }
const ChatWindow = ({ messages, loading }) => {
  const bottomRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">

      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {/* Bot avatar */}
          {msg.role === "bot" && (
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600
                            flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 mt-1">
              🤖
            </div>
          )}

          <div
            className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm whitespace-pre-line
              ${msg.role === "user"
                ? "bg-indigo-600 text-white rounded-br-sm"
                : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
          >
            {msg.text}
          </div>
        </div>
      ))}

      {/* Typing indicator while waiting for bot reply */}
      {loading && (
        <div className="flex justify-start">
          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600
                          flex items-center justify-center text-xs mr-2 flex-shrink-0">
            🤖
          </div>
          <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
            <div className="flex gap-1 items-center h-4">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}/>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}/>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}/>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;