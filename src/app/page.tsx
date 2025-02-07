"use client";

import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isMounted]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setHasSentFirstMessage(true);

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'deepseek-r1:1.5b', prompt: input, stream: false }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.response) {
        throw new Error('Invalid response format');
      }

      const botMessageContent = data.response.replace(/<think>.*<\/think>/s, '').trim();
      const thinkingContent = data.response.match(/<think>([\s\S]*?)<\/think>/)?.[1] || '';

      const botMessage: Message = { role: 'assistant', content: botMessageContent, thinking: thinkingContent };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error connecting to API:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: '⚠️ Error: Unable to fetch response.' },
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
      <Header />
      <MessageList messages={messages} isLoading={isLoading} chatRef={chatRef} />
      <MessageInput input={input} setInput={setInput} sendMessage={sendMessage} />
    </div>
  );
}