import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import { useUser } from './hooks/useUser';

function App() {
  const { isConnected } = useAccount();
  const { isRegistered, isUserLoading } = useUser();

  return (
    <div>
      <header className="absolute top-0 right-0 p-4">
        <ConnectButton />
      </header>
      <main>
        {isConnected ? (
          isUserLoading ? (
            <div className="flex items-center justify-center min-h-screen">
              <p>Loading user data...</p>
            </div>
          ) : isRegistered ? (
            <ChatPage />
          ) : (
            <RegisterPage />
          )
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Blockchain Chat</h1>
            <p className="text-lg text-gray-600">Please connect your wallet to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;