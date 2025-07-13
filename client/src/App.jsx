import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { ChatRoom } from './components/ChatRoom';
import { useSocket } from './hooks/useSocket';  // Import the hook
import { WifiIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';


function App() {
  const [user, setUser] = useState(null);
  
  // Use the socket hook here
  const { 
    socket,
    isConnected,
    isAuthenticated,
    connect,
    disconnect,
    authenticate
  } = useSocket();

  // Add the connection effect
  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('authenticated', (userData) => {
        setUser(userData);
      });

      return () => {
        socket.off('authenticated');
      };
    }
  }, [socket]);

  const handleLogin = (username, avatar) => {
    authenticate(username, avatar);
  };

  const handleLogout = () => {
    disconnect();
    setUser(null);
  };

  if (!socket || !isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Connecting to server...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="relative">
      <ChatRoom socket={socket} user={user} onLogout={handleLogout} />
      
      {/* Connection Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <Badge 
          variant={isConnected ? "default" : "destructive"}
          className="flex items-center space-x-2 px-3 py-2"
        >
          <WifiIcon className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </Badge>
      </div>
    </div>
  );
}

export default App;