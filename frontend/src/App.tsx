import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import { useUser } from './hooks/useUser';
import { useState } from 'react';

function App() {
  const { isConnected } = useAccount();
  const { isRegistered, isUserLoading } = useUser();
  // We'll use session storage to track if the user has clicked the connect button in this session
  const [hasInitiatedConnection, setHasInitiatedConnection] = useState(
    sessionStorage.getItem('hasInitiatedConnection') === 'true'
  );

  const showApp = isConnected && hasInitiatedConnection;

  return (
    <div>
      <header className="absolute top-0 right-0 p-4 z-10">
        {/* Wrap the ConnectButton to capture the user's click */}
        <div
          onClick={() => {
            if (!hasInitiatedConnection) {
              sessionStorage.setItem('hasInitiatedConnection', 'true');
              setHasInitiatedConnection(true);
            }
          }}
        >
          <ConnectButton />
        </div>
      </header>
      <main>
        {!showApp ? (
          <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Blockchain Chat</h1>
            <p className="text-lg text-gray-600">Please connect your wallet to get started.</p>
          </div>
        ) : isUserLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <p>Loading user data...</p>
          </div>
        ) : isRegistered ? (
          <ChatPage />
        ) : (
          <RegisterPage />
        )}
      </main>
    </div>
  );
}

export default App;