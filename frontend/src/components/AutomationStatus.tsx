import { useEffect, useState } from 'react';
import { useAutomation } from '../hooks/useAutomation';
import { useAutomationInfo } from '../hooks/useAutomationInfo';
import { useWatchContractEvent } from 'wagmi';
import { chatContractAddress } from '../config';
import ChatABI from '../ABIs/Chat.json';

const AutomationStatus = () => {
  const { automationContractAddress } = useAutomation();
  const { interval, lastTimeStamp, isLoading, refetchLastTimeStamp } = useAutomationInfo(automationContractAddress);
  const [nextUpdate, setNextUpdate] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useWatchContractEvent({
    address: chatContractAddress,
    abi: ChatABI,
    eventName: 'GroupMessageSent',
    onLogs(logs: any) {
        const automationLog = logs.find((log: any) => log.args.sender === automationContractAddress);
        if (automationLog) {
            refetchLastTimeStamp();
        }
    },
  });

  useEffect(() => {
    if (interval && lastTimeStamp) {
      const next = Number(lastTimeStamp) + Number(interval);
      setNextUpdate(next * 1000);
    }
  }, [interval, lastTimeStamp]);

  useEffect(() => {
    if (!nextUpdate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = nextUpdate - now;

      if (distance < 0) {
        setTimeLeft('Updating...');
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      let timeLeftString = '';
      if (hours > 0) timeLeftString += `${hours}h `;
      if (minutes > 0) timeLeftString += `${minutes}m `;
      timeLeftString += `${seconds}s`;

      setTimeLeft(timeLeftString);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextUpdate]);

  if (isLoading) {
    return <div className="text-sm text-gray-500 p-4">Loading automation status...</div>;
  }

  if (!automationContractAddress) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-200 rounded-lg m-4">
      <h3 className="font-bold text-lg text-gray-800">Chainlink Automation</h3>
      {interval ? (
        <>
            <p className="text-sm text-gray-600">Next price update in: <span className="font-mono font-semibold">{timeLeft || 'Calculating...'}</span></p>
            <p className="text-xs text-gray-500">Updates every {Number(interval)} seconds.</p>
        </>
      ) : (
        <p className="text-sm text-yellow-500">Could not load automation details.</p>
      )}
    </div>
  );
};

export default AutomationStatus;