import React, { useRef } from 'react';

interface MessageInputProps {
  input: string;
  setInput: (input: string) => void;
  sendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ input, setInput, sendMessage }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex items-center gap-2 mt-4">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        className="flex-1 p-3 border rounded-md bg-gray-700 text-white border-gray-600 placeholder-gray-500 resize-none overflow-hidden"
        placeholder="Type your message..."
        rows={1}
        style={{ maxHeight: '6rem' }} // 4 lines at 1.5rem line height
      />
      <button
        onClick={sendMessage}
        className="p-3 bg-blue-600 text-white rounded-md disabled:opacity-50 hover:bg-blue-500"
        disabled={!input.trim()}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;