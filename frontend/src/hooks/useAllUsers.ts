import { useReadContract } from 'wagmi';
import { registerContractAddress } from '../config';
import RegisterABI from '../ABIs/Register.json';
import { Address } from 'viem';
import { useMemo } from 'react';

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

  useMemo(() => {
    if (!data) return [];
    // The contract returns an array of structs, which wagmi provides as an array of arrays.
    // We need to map it to an array of objects based on the struct definition:
    // struct User { string name; string imageCid; address walletAddress; }
    return (data as [string, string, Address][]).map(userArray => ({
      name: userArray[0],
      imageCid: userArray[1],
      walletAddress: userArray[2],
    }));
  }, [data]);

  return { data, isLoading, error, refetch };
};