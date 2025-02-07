"use client";

import React, { useState, useEffect, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  thinking?: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      chatRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isMounted]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);
    setHasSentFirstMessage(true);

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "deepseek-r1:1.5b", prompt: input, stream: false }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.response) {
        throw new Error("Invalid response format");
      }

      const botMessageContent = data.response.replace(/<think>.*<\/think>/s, "").trim();
      const thinkingContent = data.response.match(/<think>([\s\S]*?)<\/think>/)?.[1] || "";

      const botMessage: Message = { role: "assistant", content: botMessageContent, thinking: thinkingContent };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error connecting to API:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "⚠️ Error: Unable to fetch response." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto p-6 border border-gray-700 shadow-lg rounded-md bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-400">Pet Deep-Seek</h1>
      <div className="flex-1 overflow-y-auto space-y-4 p-4 border-b border-gray-700 relative">
        {!hasSentFirstMessage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">🤖</div>
            <div className="text-lg text-gray-400">Ask me smart questions to get intelligent answers!</div>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`relative p-4 max-w-[75%] ${msg.role === "user" ? "bg-blue-600 text-white rounded-bl-3xl rounded-tl-3xl rounded-tr-md" : "bg-gray-700 text-white rounded-br-3xl rounded-tr-3xl rounded-tl-md"}`}>
              {msg.thinking && msg.thinking.trim() && (
                <div className="text-sm text-gray-400 mb-1">
                  <strong>Bot's thoughts:</strong> {msg.thinking}
                </div>
              )}
              <div>{msg.content}</div>
              <div className={`absolute top-0 ${msg.role === "user" ? "right-0 transform translate-x-1/2" : "left-0 transform -translate-x-1/2"} w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ${msg.role === "user" ? "border-l-[10px] border-l-blue-600" : "border-r-[10px] border-r-gray-700"}`}></div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="animate-pulse text-lg text-gray-400">🤔 Thinking...</div>
          </div>
        )}
        <div ref={chatRef} /> {/* Auto-scroll target */}
      </div>
      <div className="flex items-center gap-2 mt-4">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="flex-1 p-3 border rounded-md bg-gray-700 text-white border-gray-600 placeholder-gray-500 resize-none overflow-hidden"
          placeholder="Type your message..."
          rows={1}
          style={{ maxHeight: "6rem" }} // 4 lines at 1.5rem line height
        />
        <button
          onClick={sendMessage}
          className="p-3 bg-blue-600 text-white rounded-md disabled:opacity-50 hover:bg-blue-500"
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}