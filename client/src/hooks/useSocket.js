import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_SERVER_URL, socketOptions } from '../config/socketconfig';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const socketRef = useRef(null);

  const connect = () => {
if (socketRef.current?.connected) {
  return socketRef.current;
}

    console.log('Connecting to server:', SOCKET_SERVER_URL);
    
    const socket = io(SOCKET_SERVER_URL, socketOptions);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      setIsConnected(false);
      setIsAuthenticated(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    socket.on('authenticated', (userData) => {
      console.log('User authenticated:', userData);
      setIsAuthenticated(true);
    });

    socket.on('authentication_error', (error) => {
      console.error('Authentication error:', error);
      setIsAuthenticated(false);
    });

    return socket;
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setIsAuthenticated(false);
    }
  };

  const authenticate = (username, avatar) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('authenticate', { username, avatar });
    } else {
      console.error('Cannot authenticate: socket not connected');
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    isAuthenticated,
    connectionError,
    connect,
    disconnect,
    authenticate
  };
};