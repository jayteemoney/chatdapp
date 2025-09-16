import { useState, useEffect, useRef } from 'react';
import MessageInput from './MessageInput';
import { useChat, usePrivateMessages } from '../hooks/useChat';
import { useAccount } from 'wagmi';
import { User } from '../hooks/useAllUsers';
import { useWatchContractEvent } from 'wagmi';
import { chatContractAddress } from '../config';
import ChatABI from '../ABIs/Chat.json';
// import { log } from 'console';

interface ChatWindowProps {
    selectedUser: User | undefined;
    onSelectUser: (user: User | undefined) => void;
}

const ChatWindow = ({ selectedUser, onSelectUser }: ChatWindowProps) => {
  const [activeTab, setActiveTab] = useState<'group' | 'private'>('group');
  const { address: currentUserAddress } = useAccount();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { groupMessages, refetchGroupMessages } = useChat();
  const { privateMessages, refetchPrivateMessages } = usePrivateMessages(currentUserAddress, selectedUser?.walletAddress);

  useWatchContractEvent({
    address: chatContractAddress,
    abi: ChatABI,
    eventName: 'GroupMessageSent',
    onLogs() {
      refetchGroupMessages();
    },
  });

  useWatchContractEvent({
    address: chatContractAddress,
    abi: ChatABI,
    eventName: 'PrivateMessageSent',
    onLogs(logs: any) {
        const relevantLog = logs.find((log: any) => {
            const { sender, recipient } = log.args;
            return (sender === currentUserAddress && recipient === selectedUser?.walletAddress) ||
                   (sender === selectedUser?.walletAddress && recipient === currentUserAddress);
        });
        if (relevantLog) {
            refetchPrivateMessages();
        }
    },
  });

  useEffect(() => {
    if (activeTab === 'private' && !selectedUser) {
      setActiveTab('group');
    }
  }, [selectedUser, activeTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupMessages, privateMessages]);

  const messagesToDisplay = activeTab === 'group' ? groupMessages : privateMessages;
  console.log(messagesToDisplay);

  const renderMessages = () => {
    if (!messagesToDisplay) {
      return <div className="text-center text-gray-500">Loading messages...</div>;
    }
    if ((messagesToDisplay as any[]).length === 0) {
        if (activeTab === 'group') return <div className="text-center text-gray-500">No group messages yet. Be the first to say something!</div>;
        if (activeTab === 'private' && selectedUser) return <div className="text-center text-gray-500">No messages with {selectedUser.name} yet. Start the conversation!</div>;
        return <div className="text-center text-gray-500">Select a user to start a private chat.</div>;
    }

    return (messagesToDisplay as any[]).map((msg, index) => (
        <div key={index} className={`flex my-2 ${msg.sender === currentUserAddress ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-md ${msg.sender === currentUserAddress ? 'bg-indigo-500 text-white' : 'bg-white text-gray-900'}`}>
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-right mt-1 opacity-75">{new Date(Number(msg.timestamp) * 1000).toLocaleTimeString()}</p>
            </div>
        </div>
    ));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <h2 className="text-xl font-bold">
          {activeTab === 'group' ? 'Group Chat' : `Chat with ${selectedUser?.name || ''}`}
        </h2>
        <div className="flex space-x-2 w-2/4">
          <button
            onClick={() => { setActiveTab('group'); onSelectUser(undefined); }}
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'group' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Group Chat
          </button>
          <button
            onClick={() => setActiveTab('private')}
            disabled={!selectedUser}
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'private' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Private Chat
          </button>
        </div>
      </header>
      <main className="flex-grow p-4 overflow-y-auto">
        {renderMessages()}
        <div ref={messagesEndRef} />
      </main>
      <MessageInput 
        chatType={activeTab} 
        recipient={activeTab === 'private' ? selectedUser?.walletAddress : undefined} 
      />
    </div>
  );
};

export default ChatWindow;