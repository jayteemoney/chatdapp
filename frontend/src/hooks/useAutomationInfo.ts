import { useReadContract } from 'wagmi';
import { Address } from 'viem';
import AutomationABI from '../ABIs/Automation.json';

export const useAutomationInfo = (automationContractAddress?: Address) => {
  const { data: interval, isLoading: isIntervalLoading } = useReadContract({
    address: automationContractAddress,
    abi: AutomationABI,
    functionName: 'interval',
    query: {
      enabled: !!automationContractAddress,
    }
  });

  const { data: lastTimeStamp, isLoading: isLastTimeStampLoading, refetch: refetchLastTimeStamp } = useReadContract({
    address: automationContractAddress,
    abi: AutomationABI,
    functionName: 'lastTimeStamp',
    query: {
      enabled: !!automationContractAddress,
    }
  });

  return {
    interval: interval as bigint | undefined,
    lastTimeStamp: lastTimeStamp as bigint | undefined,
    isLoading: isIntervalLoading || isLastTimeStampLoading,
    refetchLastTimeStamp,
  };
};