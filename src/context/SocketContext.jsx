import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';

const SocketContext = createContext({
  socket: null,
  onlineUsers: [],
  isConnected: false,
  showNotification: () => {},
});

export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const user = useSelector((state) => state.user);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const showNotification = (message, severity = 'info') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const userId = user?._id;

    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      console.log('⚡ Socket.io connected:', socketInstance.id);
      setIsConnected(true);

      if (userId) {
        socketInstance.emit('user:join', { _id: userId, username: user?.username, role: user?.role });
      }
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 Socket.io disconnected:', reason);
      setIsConnected(false);
    });

    socketInstance.on('online:users', (users) => {
      setOnlineUsers(users || []);
    });

    socketInstance.on('task:updated', (data) => {
      showNotification(`Task status updated: ${data?.title || 'Task'}`, 'info');
    });

    socketInstance.on('leave:updated', () => {
      showNotification(`Leave status update received`, 'warning');
    });

    socketInstance.on('announcement:new', (data) => {
      showNotification(`📢 New Announcement: ${data?.title || 'Notification'}`, 'success');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off('connect');
      socketInstance.off('disconnect');
      socketInstance.off('online:users');
      socketInstance.off('task:updated');
      socketInstance.off('leave:updated');
      socketInstance.off('announcement:new');
      socketInstance.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, isConnected, showNotification }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%', borderRadius: '10px' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </SocketContext.Provider>
  );
};
