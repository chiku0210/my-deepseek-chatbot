import React from 'react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, thinking }) => {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`relative p-4 max-w-[75%] ${role === 'user' ? 'bg-blue-600 text-white rounded-bl-3xl rounded-tl-3xl rounded-tr-md' : 'bg-gray-700 text-white rounded-br-3xl rounded-tr-3xl rounded-tl-md'}`}>
        {thinking && thinking.trim() && (
          <div className="text-sm text-gray-400 mb-1">
            <strong>Bot's thoughts:</strong> {thinking}
          </div>
        )}
        <div>{content}</div>
        <div className={`absolute top-0 ${role === 'user' ? 'right-0 transform translate-x-1/2' : 'left-0 transform -translate-x-1/2'} w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ${role === 'user' ? 'border-l-[10px] border-l-blue-600' : 'border-r-[10px] border-r-gray-700'}`}></div>
      </div>
    </div>
  );
};

export default MessageBubble;