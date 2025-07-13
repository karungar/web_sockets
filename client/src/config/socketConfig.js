// Socket.IO client configuration
export const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3001';

export const socketOptions = {
  transports: ['websocket', 'polling'],
  upgrade: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 5000,
  forceNew: false
};

export default {
  SOCKET_SERVER_URL,
  socketOptions
};