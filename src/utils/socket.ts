import { io } from 'socket.io-client';

// Create socket instance
export const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Setup socket event listeners for connection status
socket.on('connect', () => {
  console.log('Socket connected with ID:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

socket.on('reconnect', (attempt) => {
  console.log('Socket reconnected after attempt:', attempt);
});

socket.on('reconnect_error', (error) => {
  console.error('Socket reconnection error:', error);
});

// Connect to socket server
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// Disconnect from socket server
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;