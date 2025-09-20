import { useAccount } from 'wagmi';
import AutomationStatus from './AutomationStatus';
import { useReadContract } from 'wagmi';
import { registerContractAddress } from '../config';
import RegisterABI from '../ABIs/Register.json';

interface User {
  name: string;
  walletAddress: `0x${string}`;
  imageCid: string;
}

interface UserListProps {
  onSelectUser: (user: User) => void;
  selectedUser: User | undefined;
}

const UserList = ({ onSelectUser, selectedUser }: UserListProps) => {
  const { address: currentUserAddress } = useAccount();

  const { data: allUsers, isLoading: isAllUsersLoading } = useReadContract({
    address: registerContractAddress,
    abi: RegisterABI,
    functionName: 'getAllUsers',
  });

  const { data: currentUser, isLoading: isUserLoading } = useReadContract({
    address: registerContractAddress,
    abi: RegisterABI,
    functionName: 'getUser',
    args: [currentUserAddress],
  });

  if (isAllUsersLoading || isUserLoading) {
    return <div className="p-4 text-gray-500">Loading users...</div>;
  }

  if (!allUsers || !currentUser) {
    return <div className="p-4 text-red-500">Could not load user data.</div>;
  }

  const otherUsers = (allUsers as User[]).filter(
    (user) => user.walletAddress !== currentUserAddress
  );

  return (
    <div className="h-full bg-gray-50 text-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <img
          src={`https://gateway.pinata.cloud/ipfs/${(currentUser as User).imageCid}`}
          alt={(currentUser as User).name}
          className="w-12 h-12 rounded-full mr-4 object-cover"
        />
        <div>
          <h2 className="text-xl font-bold">Welcome, {(currentUser as User).name}</h2>
          <p className="text-sm text-gray-500">
            {(currentUserAddress as `0x${string}`).slice(0, 6)}...
            {(currentUserAddress as `0x${string}`).slice(-4)}
          </p>
        </div>
      </div>
      <AutomationStatus />
      <div className="flex-grow overflow-y-auto">
        <h3 className="p-4 text-lg font-semibold text-gray-600">Users</h3>
        <ul>
          {otherUsers.map((user) => (
            <li
              key={user.walletAddress}
              onClick={() => onSelectUser(user)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-200 ${
                selectedUser?.walletAddress === user.walletAddress ? 'bg-gray-200' : ''
              }`}
            >
              <img
                src={`https://gateway.pinata.cloud/ipfs/${user.imageCid}`}
                alt={user.name}
                className="w-10 h-10 rounded-full mr-4 object-cover"
              />
              <p className="font-semibold">{user.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserList;