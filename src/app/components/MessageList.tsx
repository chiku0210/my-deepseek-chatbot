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
  chatRef: RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, chatRef }) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-4 border-b border-gray-700 relative">
      {messages.map((msg, index) => (
        <MessageBubble key={index} role={msg.role} content={msg.content} thinking={msg.thinking} />
      ))}
      {isLoading && (
        <div className="flex justify-center items-center">
          <div className="animate-pulse text-lg text-gray-400">🤔 Thinking...</div>
        </div>
      )}
      <div ref={chatRef} /> {/* Auto-scroll target */}
    </div>
  );
};

export default MessageList;