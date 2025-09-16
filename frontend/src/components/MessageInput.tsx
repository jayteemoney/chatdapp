import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { Address } from 'viem';

interface MessageInputProps {
  chatType: 'group' | 'private';
  recipient?: Address; // for private chat
}

const MessageInput = ({ chatType, recipient }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const { sendGroupMessage, sendPrivateMessage, isSending } = useChat();

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    if (chatType === 'group') {
      sendGroupMessage(message);
    } else if (chatType === 'private' && recipient) {
      sendPrivateMessage(recipient, message);
    }

    setMessage('');
  };

  return (
    <div className="p-4 bg-white border-t">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isSending || (chatType === 'private' && !recipient)}
        />
        <button 
          onClick={handleSendMessage} 
          className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-r-md hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-400"
          disabled={isSending || (chatType === 'private' && !recipient)}
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;