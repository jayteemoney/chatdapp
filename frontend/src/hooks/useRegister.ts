import { useWriteContract } from 'wagmi';
import { registerContractAddress } from '../config';
import RegisterABI from '../ABIs/Register.json';

export const useRegister = () => {
  const { writeContract, isPending, error } = useWriteContract();

  const registerUser = (name: string, imageCid: string) => {
    writeContract({
      address: registerContractAddress,
      abi: RegisterABI,
      functionName: 'registerUser',
      args: [name, imageCid],
    });
  };

  return { registerUser, isRegistering: isPending, registrationError: error };
};