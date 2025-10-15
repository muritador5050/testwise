import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '../api/apiClient';

export const useWebSocket = (attemptId?: number) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
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
      setIsConnected(true);

      // Only join attempt room if attemptId is provided (for students)
      if (attemptId) {
        socketRef.current?.emit('join-attempt', attemptId);
      }
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    if (attemptId) {
      socketRef.current.on('joined-attempt', (data: { attemptId: number }) => {
        console.log('Joined attempt room:', data.attemptId);
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [attemptId]);

  const socket = socketRef.current;

  const on = useCallback(
    <T = unknown>(event: string, callback: (data: T) => void) => {
      socket?.on(event, callback);
    },
    [socket]
  );

  const off = useCallback(
    <T = unknown>(event: string, callback: (data: T) => void) => {
      socket?.off(event, callback);
    },
    [socket]
  );

  return { socket, isConnected, on, off };
};
