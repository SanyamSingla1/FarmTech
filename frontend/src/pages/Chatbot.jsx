import React, { useState } from "react";
import { chatWithAI } from "../api/api";
import "./Chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const question = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: question }]);

    try {
      const response = await chatWithAI(question);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: response.reply || "I couldn't answer that." },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>🤖 AI Farming Assistant</h2>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h3>Welcome to your AI Farming Assistant!</h3>
            <p>Ask me anything about farming, crops, irrigation, or pest management.</p>
            <div className="suggestions">
              <button onClick={() => setInputMessage("How do I improve soil fertility?")}>💡 Soil fertility tips</button>
              <button onClick={() => setInputMessage("When should I irrigate my wheat crop?")}>💧 Irrigation schedule</button>
              <button onClick={() => setInputMessage("What fertilizer should I use for tomatoes?")}>🌱 Fertilizer recommendations</button>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message-group ${msg.role}`}>
              <div className="message-avatar">{msg.role === "user" ? "👤" : "🤖"}</div>
              <div className="message-content">
                <p>{msg.text}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="ai-message loading">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="chat-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask me about farming, crops, irrigation..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !inputMessage.trim()}>
          {isLoading ? "⏳" : "📤"}
        </button>
      </form>
    </div>
  );
}
