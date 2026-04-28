import { useState } from "react";
import Chatbot from "../components/Chatbot";

function ChatbotPage({ messages, setMessages, onClear }) {
  const [loading, setLoading] = useState(false);
  const [input, setInput]     = useState("");

  return (
    <div style={{ padding: "0 2rem 2rem 2rem" }}>

      <h2 style={{ marginBottom: "1.5rem", color: "#1a4d1a" }}>
        🤖 CropWise AI Chatbot
      </h2>

      {/* Push chatbot to the right with left margin */}
      <div style={{ marginLeft: "1.5rem" }}>
        <Chatbot
          messages={messages}
          setMessages={setMessages}
          onClear={onClear}
          loading={loading}
          setLoading={setLoading}
          input={input}
          setInput={setInput}
        />
      </div>

    </div>
  );
}

export default ChatbotPage;