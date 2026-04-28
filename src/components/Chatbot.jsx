import { useRef, useEffect } from "react";
import styles from "./Chatbot.module.css";
import { API_URL } from "../services/api";
function renderMarkdown(text) {
  const lines = text.split("\n");
  const elements = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line.trim()) {
      elements.push(<br key={key++} />);
      continue;
    }

    // Numbered list: "1. **Title**: text"
    const listMatch = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*:?\s*(.*)/);
    if (listMatch) {
      elements.push(
        <div key={key++} className={styles.listItem}>
          <span className={styles.listNum}>{listMatch[1]}.</span>
          <span>
            <strong>{listMatch[2]}</strong>
            {listMatch[3] ? `: ${listMatch[3]}` : ""}
          </span>
        </div>
      );
      continue;
    }

    // Inline **bold**
    const parts = line.split(/\*\*(.+?)\*\*/g);
    const inline = parts.map((part, idx) =>
      idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
    );
    elements.push(
      <p key={key++} className={styles.msgLine}>{inline}</p>
    );
  }
  return elements;
}

// ── Component ─────────────────────────────────────────────────
function Chatbot({ messages, setMessages, onClear, loading, setLoading, input, setInput }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText        = input.trim();
    const updatedMessages = [...messages, { sender: "user", text: userText }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const history = updatedMessages
        .slice(0, -1)
        .filter(m => !(m.sender === "bot" && m.text.startsWith("👋")))
        .map(msg => ({
          role:    msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        }));

      const res = await fetch(`${API_URL}/api/chat`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message: userText, history }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");

      setMessages(prev => [...prev, { sender: "bot", text: data.reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "⚠️ Could not connect to server. Make sure the backend is running on port 8000." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.chatContainer}>

      {/* Header */}
      <div className={styles.chatHeader}>
        <span>🌾 CropWise AI</span>
        <button className={styles.clearBtn} onClick={onClear}>
          🗑 Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? styles.userRow : styles.botRow}
          >
            {msg.sender === "bot" && (
              <div className={`${styles.avatar} ${styles.botAvatar}`}>🌿</div>
            )}

            <div className={msg.sender === "user" ? styles.userBubble : styles.botBubble}>
              {msg.sender === "bot" ? renderMarkdown(msg.text) : msg.text}
            </div>

            {msg.sender === "user" && (
              <div className={`${styles.avatar} ${styles.userAvatar}`}>👤</div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className={styles.botRow}>
            <div className={`${styles.avatar} ${styles.botAvatar}`}>🌿</div>
            <div className={styles.botBubble}>
              <div className={styles.typing}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={styles.inputArea}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about crops, soil, fertilizer..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>

    </div>
  );
}

export default Chatbot;
