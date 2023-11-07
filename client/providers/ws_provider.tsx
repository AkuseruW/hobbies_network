'use client';
import { getAccessTokenFromClient } from '@/utils/_auth_client_info';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext<WebSocket | null>(null);

export const useWebSocket = (): WebSocket | null => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws/?token=${getAccessTokenFromClient()}`);
    setSocket(newSocket);

    return () => {
      if (newSocket.readyState === 1) {
        newSocket.close();
      }
    };
  }, []);


  return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>;
};
