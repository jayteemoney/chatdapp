import { useState, useEffect, useRef } from 'react';
import MessageInput from './MessageInput';
import { useChat, usePrivateMessages } from '../hooks/useChat';
import { useAccount } from 'wagmi';
import { useWatchContractEvent } from 'wagmi';
import { chatContractAddress } from '../config';
import ChatABI from '../ABIs/Chat.json';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAutomation } from '../hooks/useAutomation';

interface User {
  name: string;
  walletAddress: `0x${string}`;
  imageCid: string;
}

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
  const { automationContractAddress } = useAutomation();

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

    return (messagesToDisplay as any[]).map((msg, index) => {
        const isAutomationMessage = msg.sender === automationContractAddress;
        const messageSender = isAutomationMessage ? 'Chainlink Automation' : msg.sender;

        return (
            <div key={index} className={`flex my-3 ${msg.sender === currentUserAddress ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-xl ${
                    isAutomationMessage 
                        ? 'bg-blue-500 text-white' 
                        : msg.sender === currentUserAddress 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-white text-gray-900'
                }`}>
                    {isAutomationMessage && <p className="text-sm font-bold mb-1">🤖 Automated Price Feed</p>}
                    <p className="text-base">{msg.content}</p>
                    <p className="text-xs text-right mt-2 opacity-60">
                        {new Date(Number(msg.timestamp) * 1000).toLocaleTimeString()}
                    </p>
                </div>
            </div>
        );
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="flex items-center justify-between p-4 bg-white shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800">
          {activeTab === 'group' ? 'Group Chat' : `Chat with ${selectedUser?.name || ''}`}
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => { setActiveTab('group'); onSelectUser(undefined); }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out ${activeTab === 'group' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              Group Chat
            </button>
            <button
              onClick={() => setActiveTab('private')}
              disabled={!selectedUser}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out ${activeTab === 'private' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Private Chat
            </button>
          </div>
          <ConnectButton />
        </div>
      </header>
      <main className="flex-grow p-6 overflow-y-auto">
        {renderMessages()}
        <div ref={messagesEndRef} />
      </main>
      <div className="p-4 bg-white">
        <MessageInput
          chatType={activeTab}
          recipient={activeTab === 'private' ? selectedUser?.walletAddress : undefined}
        />
      </div>
    </div>
  );
};

export default ChatWindow;