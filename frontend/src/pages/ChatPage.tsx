import UserList from '../components/UserList';
import ChatWindow from '../components/ChatWindow';
import { useState } from 'react';
import { User } from '../hooks/useAllUsers';

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-screen">
      <div className="md:col-span-1 border-r border-gray-200">
        <UserList onSelectUser={setSelectedUser} selectedUser={selectedUser} />
      </div>
      <div className="md:col-span-3">
        <ChatWindow selectedUser={selectedUser} onSelectUser={setSelectedUser} />
      </div>
    </div>
  );
};

export default ChatPage;