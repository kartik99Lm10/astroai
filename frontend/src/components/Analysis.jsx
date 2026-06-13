import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const Analysis = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chat visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "User", text: input }]);
    setLoading(true);

    try {
      const response = await axios.post("https://astrogpt-gallants-1.onrender.com/api/chat", {
        message: input,
      });

      console.log("API Response:", response.data);
      const botMessage = response.data.message || "No response from the bot.";

      setMessages((prev) => [...prev, { sender: "Bot", text: botMessage }]);
    } catch (error) {
      console.error("Error:", error);

      setMessages((prev) => [
        ...prev,
        { sender: "Bot", text: "Error: Unable to fetch response." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div>
      {/* Chatbot Icon */}
      <div
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#007BFF",
          color: "#fff",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        💬
      </div>

      {/* Chatbox */}
      {isChatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "50px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            maxHeight: "600px",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "15px",
              background: "#007BFF",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "bold",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            Chatbot
          </div>
          <div
            style={{
              flexGrow: 1,
              padding: "15px",
              overflowY: "scroll",
              backgroundColor: "#f9f9f9",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.sender === "User" ? "right" : "left",
                  margin: "10px 0",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "10px",
                    borderRadius: "10px",
                    background: msg.sender === "User" ? "#007BFF" : "#e0e0e0",
                    color: msg.sender === "User" ? "#fff" : "#000",
                    maxWidth: "75%",
                    wordWrap: "break-word",
                  }}
                >
                  {msg.sender === "Bot" ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: "10px",
              padding: "10px",
              borderTop: "1px solid #ccc",
              backgroundColor: "#fff",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your personalized analysis or ask a question..."
              style={{
                flexGrow: 1,
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                background: loading ? "#ccc" : "#007BFF",
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Analysis;
