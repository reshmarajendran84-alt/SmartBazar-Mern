import { useEffect, useRef } from "react";

const ChatWindow = ({ messages, loading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Helper to format bot messages with emojis and line breaks
  const formatBotMessage = (text) => {
    // Split by newlines and render each line
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Check if line starts with common emoji/icon patterns
      const hasEmoji = /^[😀-😎🔒⚠️✅❌🔄👤👋🚀📦🎉💳💰🏷️📋🛍️]/u.test(line) || 
                       /^[A-Za-z]\uFE0F?[\u20E3]?/.test(line) ||
                       /^[\u2600-\u26FF\u2700-\u27BF]/.test(line);
      
      return (
        <div key={i} className={hasEmoji ? "flex items-start gap-1" : ""}>
          {line}
          {i < lines.length - 1 && <br />}
        </div>
      );
    });
  };

  // Helper to render message with formatting
  const renderMessage = (text, role) => {
    if (role !== "bot") return text;
    
    // Handle bullet points and formatting
    let formattedText = text;
    
    // Convert markdown-style bullet points
    formattedText = formattedText.replace(/^[•·-]\s/gm, '• ');
    
    // Highlight order IDs (hex codes)
    formattedText = formattedText.replace(/([0-9a-f]{24})/gi, (match) => {
      return `<span class="font-mono text-xs bg-gray-100 px-1 rounded">${match}</span>`;
    });
    
    // Highlight prices
    formattedText = formattedText.replace(/₹(\d+(?:,\d+)*(?:\.\d+)?)/g, (match) => {
      return `<span class="font-semibold text-green-600">${match}</span>`;
    });
    
    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} animate-fade-in`}
        >
          <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            
            {msg.role === "bot" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100
                           flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-base">🤖</span>
              </div>
            )}

            <div
              className={`px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words
                ${msg.role === "user"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm"
                  : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
                }`}
            >
              {msg.role === "bot" ? formatBotMessage(msg.text) : msg.text}
            </div>
          </div>

          {msg.time && (
            <span className="text-gray-400 mt-0.5 px-1 text-[10px]">
              {msg.time}
            </span>
          )}
        </div>
      ))}

      {loading && (
        <div className="flex justify-start items-end gap-2 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100
                       flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-base">🤖</span>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
            <div className="flex gap-1 items-center h-4">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
      
    
    </div>
  );
};

export default ChatWindow;