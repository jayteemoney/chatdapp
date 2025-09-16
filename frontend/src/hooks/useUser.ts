import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';
import { registerContractAddress } from '../config';
import RegisterABI from '../ABIs/Register.json';

export const useUser = () => {
  const { address } = useAccount();

  const { data: user, isLoading: isUserLoading, error: userError, refetch } = useReadContract({
    address: registerContractAddress,
    abi: RegisterABI,
    functionName: 'getUser',
    args: [address],
    query: {
      enabled: !!address, 
    },
  });

  useWatchContractEvent({
    address: registerContractAddress,
    abi: RegisterABI,
    eventName: 'UserRegistered',
    onLogs: () => {
      refetch()
    }
  })

  // The contract returns a user struct. If the walletAddress is not the zero address, the user is registered.
  const isRegistered = user ? (user as any).walletAddress !== '0x0000000000000000000000000000000000000000' : false;

  return { user, isRegistered, isUserLoading, userError };
};