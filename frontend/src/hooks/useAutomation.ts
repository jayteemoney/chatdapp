import { useReadContract } from 'wagmi';
import { chatContractAddress } from '../config';
import ChatABI from '../ABIs/Chat.json';
import { Address } from 'viem';

export const useAutomation = () => {
  const { data: automationContractAddress, isLoading: isAutomationAddressLoading } = useReadContract({
    address: chatContractAddress,
    abi: ChatABI,
    functionName: 'automationContract',
  });

  return { automationContractAddress: automationContractAddress as Address | undefined, isAutomationAddressLoading };
};