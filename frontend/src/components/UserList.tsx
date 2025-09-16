import { useAllUsers, User } from '../hooks/useAllUsers';
// import { useAccount } from 'wagmi';
import { useWatchContractEvent } from 'wagmi';
import { registerContractAddress } from '../config';
import RegisterABI from '../ABIs/Register.json';
import { useMemo, useEffect } from 'react';

interface UserListProps {
    onSelectUser: (user: User) => void;
    selectedUser: User | undefined;
}

const UserList = ({ onSelectUser, selectedUser }: UserListProps) => {
  const { data, isLoading, error, refetch } = useAllUsers();
  // const { address: currentUserAddress } = useAccount();

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch users:", error);
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
  

  const allUsers = useMemo(() => {
    if ((data as any[])?.length === 0) return [];
    return (data as any[])?.map(user => ({ name: user.args?.name, walletAddress: user.args?.walletAddress, imageCid: user.args?.imageCid })) || [];
  }, [data]);
  console.log("Users fetched successfully:", allUsers);

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading users.</div>;
    console.log("Error loading users", error);
  }

  return (
    <div className="h-full bg-gray-50 border-r border-gray-200">
      <h2 className="p-4 text-xl font-bold border-b">Users</h2>
      <ul className="overflow-y-auto">
        {allUsers.length === 0 ? (
          <li className="p-3 text-center text-gray-500">No other users found.</li>
        ) : (
          allUsers.map((user) => (
            <li 
              key={user.walletAddress} 
              className={`flex items-center p-3 space-x-3 cursor-pointer hover:bg-gray-200 ${selectedUser?.walletAddress === user.walletAddress ? 'bg-indigo-100' : ''}`}
              onClick={() => onSelectUser(user)}
            >
              <img 
                src={`https://gateway.pinata.cloud/ipfs/${user.imageCid}`} 
                alt={user.name} 
                className="w-10 h-10 bg-gray-300 rounded-full object-cover"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/40' }} // Fallback image
              />
              <div className="overflow-hidden">
                <p className="font-semibold truncate">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">{user.walletAddress}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default UserList;