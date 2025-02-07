"use client";  // Ensure this is at the top

import { useState, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false); // Ensures client-side rendering

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevents hydration mismatch

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "deepseek-r1:1.5b", prompt: input, stream: false }),
      });

      const data = await response.json();
      const botMessage: Message = { role: "assistant", content: data.response };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error connecting to Ollama:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto p-4 border shadow-lg rounded-md">
      <div className="flex-1 overflow-y-auto space-y-2 p-2 border-b">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${msg.role === "user" ? "bg-blue-200 self-end" : "bg-gray-200 self-start"
              }`}
          >
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-md"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-500 text-white rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
