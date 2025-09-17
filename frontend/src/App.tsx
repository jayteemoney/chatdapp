import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import ChatPage from './pages/ChatPage';
import RegisterPage from './pages/RegisterPage';
import { useUser } from './hooks/useUser';
import './App.css';

function App() {
  const { isConnected } = useAccount();
  const { isRegistered, isUserLoading } = useUser();

  const renderContent = () => {
    if (!isConnected) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to ChatDApp</h1>
          <ConnectButton />
        </div>
      );
    }

    if (isUserLoading) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-2xl font-semibold text-gray-600">Loading user data...</div>
        </div>
      );
    }

    if (!isRegistered) {
      return <RegisterPage />;
    }

    return <ChatPage />;
  };

  return <div className="bg-gray-50 min-h-screen">{renderContent()}</div>;
}

export default App;