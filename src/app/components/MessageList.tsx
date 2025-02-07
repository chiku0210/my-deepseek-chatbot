import React, { RefObject } from 'react';
import MessageBubble from './MessageBubble';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  chatRef: RefObject<HTMLDivElement | null>;
  hasSentFirstMessage: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, chatRef, hasSentFirstMessage }) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-4 border-b border-gray-700 relative">
      {!hasSentFirstMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl mb-4">🤖</div>
          <div className="text-lg text-gray-400">Ask me smart questions to get intelligent answers!</div>
        </div>
      )}
      {messages.map((msg, index) => (
        <MessageBubble key={index} role={msg.role} content={msg.content} thinking={msg.thinking} />
      ))}
      {isLoading && (
        <div className="flex justify-center items-center">
          <div className="animate-pulse text-lg text-gray-400">Thinking... 🤔</div>
        </div>
      )}
      <div ref={chatRef} /> {/* Auto-scroll target */}
    </div>
  );
};

export default MessageList;