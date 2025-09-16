import { useWriteContract, useReadContract } from 'wagmi';
import { chatContractAddress } from '../config';
import ChatABI from '../ABIs/Chat.json';
import { Address } from 'viem';

export const useChat = () => {
  const { writeContract, isPending: isSending, error: sendError } = useWriteContract();

  const sendGroupMessage = (content: string) => {
    writeContract({
      address: chatContractAddress,
      abi: ChatABI,
      functionName: 'sendGroupMessage',
      args: [content],
    });
  };

  const sendPrivateMessage = (recipient: Address, content: string) => {
    writeContract({
      address: chatContractAddress,
      abi: ChatABI,
      functionName: 'sendPrivateMessage',
      args: [recipient, content],
    });
  };

  const { data: groupMessages, refetch: refetchGroupMessages } = useReadContract({
    address: chatContractAddress,
    abi: ChatABI,
    functionName: 'getGroupMessages',
  });

  return { 
    sendGroupMessage, 
    sendPrivateMessage, 
    isSending, 
    sendError,
    groupMessages,
    refetchGroupMessages,
  };
};

export const usePrivateMessages = (user1?: Address, user2?: Address) => {
    const { data: privateMessages, refetch: refetchPrivateMessages } = useReadContract({
        address: chatContractAddress,
        abi: ChatABI,
        functionName: 'getPrivateMessages',
        args: user1 && user2 ? [user1, user2] : undefined,
        query: {
            enabled: !!user1 && !!user2,
        }
    });

    return { privateMessages, refetchPrivateMessages };
}