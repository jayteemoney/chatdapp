import { useAllUsers, User } from '../hooks/useAllUsers';
import { useAccount } from 'wagmi';
import { useWatchContractEvent } from 'wagmi';
import { registerContractAddress } from '../config';
import RegisterABI from '../ABIs/Register.json';
import { useMemo, useEffect } from 'react';

interface UserListProps {
    onSelectUser: (user: User) => void;
    selectedUser: User | undefined;
}

const UserList = ({ onSelectUser, selectedUser }: UserListProps) => {
  const { users, isLoading, error, refetch } = useAllUsers();
  const { address: currentUserAddress } = useAccount();

  useEffect(() => {
    if (error) {
      console.error("UserList component error:", error);
    }
  }, [error]);

  useWatchContractEvent({
    address: registerContractAddress,
    abi: RegisterABI,
    eventName: 'UserRegistered',
    onLogs() {
      refetch();
    },
  });

  const otherUsers = useMemo(() => {
    if (!users || !currentUserAddress) return [];
    return users.filter(user => user && user.walletAddress && user.walletAddress.toLowerCase() !== currentUserAddress.toLowerCase());
  }, [users, currentUserAddress]);

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading users. Please check the console.</div>;
  }

  return (
    <div className="h-full bg-gray-50 border-r border-gray-200">
      <h2 className="p-4 text-xl font-bold border-b">Users</h2>
      <ul className="overflow-y-auto">
        {otherUsers.length > 0 ? (
          otherUsers.map((user) => (
            <li 
              key={user.walletAddress} 
              className={`flex items-center p-3 space-x-3 cursor-pointer hover:bg-gray-200 ${selectedUser?.walletAddress === user.walletAddress ? 'bg-indigo-100' : ''}`}
              onClick={() => onSelectUser(user)}
            >
              <img 
                src={`https://gateway.pinata.cloud/ipfs/${user.imageCid}`} 
                alt={user.name} 
                className="w-10 h-10 bg-gray-300 rounded-full object-cover"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/40' }}
              />
              <div className="overflow-hidden">
                <p className="font-semibold truncate">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">{user.walletAddress}</p>
              </div>
            </li>
          ))
        ) : (
          <li className="p-3 text-center text-gray-500">No other users found.</li>
        )}
      </ul>
    </div>
  );
};

export default UserList;