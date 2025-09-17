import { useReadContract } from 'wagmi';
import { registerContractAddress } from '../config';
import RegisterABI from '../ABIs/Register.json';
import { Address } from 'viem';
import { useMemo, useEffect } from 'react';

export interface User {
    name: string;
    imageCid: string;
    walletAddress: Address;
}

export const useAllUsers = () => {
  const { data, isLoading, error, refetch } = useReadContract({
    address: registerContractAddress,
    abi: RegisterABI,
    functionName: 'getAllUsers',
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching users:", error);
    }
  }, [error]);

  const users = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    
    const firstElement = data[0];
    let mappedUsers: User[];

    if (typeof firstElement === 'object' && firstElement !== null && 'name' in firstElement) {
      // Handles array of objects: [{ name, imageCid, walletAddress }, ...]
      mappedUsers = data as User[];
    } else if (Array.isArray(firstElement)) {
      // Handles array of arrays: [[name, imageCid, walletAddress], ...]
      mappedUsers = (data as [string, string, Address][]).map(userArray => ({
        name: userArray[0],
        imageCid: userArray[1],
        walletAddress: userArray[2],
      }));
    } else {
      console.error("Received unknown data structure for users:", data);
      return [];
    }
    
    return mappedUsers.filter(user => user.walletAddress && user.name);
  }, [data]);

  return { users, isLoading, error, refetch };
};