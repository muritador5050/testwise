import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '../api/apiClient';

export const useWebSocket = (attemptId?: number) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!attemptId) return;

    const token = getAuthToken();
    if (!token) return;

    socketRef.current = io(
      import.meta.env.VITE_WS_URL || 'http://localhost:5000',
      {
        auth: { token },
        transports: ['websocket'],
      }
    );

    socketRef.current.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);

      // Join the attempt room
      socketRef.current?.emit('join-attempt', attemptId);
    });

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('joined-attempt', (data) => {
      console.log('Joined attempt room:', data.attemptId);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [attemptId]);

  const socket = socketRef.current;

  const on = useCallback(
    (event: string, callback: (data: unknown) => void) => {
      socket?.on(event, callback);
    },
    [socket]
  );

  const off = useCallback(
    (event: string, callback: (data: unknown) => void) => {
      socket?.off(event, callback);
    },
    [socket]
  );

  return { socket, isConnected, on, off };
};
