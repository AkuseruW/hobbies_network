'use client';
import { useNotificationsStore } from '@/lib/store/notifications_store';
import { usePostsStore } from '@/lib/store/posts_store';
import { getAccessTokenFromClient } from '@/utils/_auth_client_info';
import { setupWebSocket } from '@/utils/_ws_messages';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context to manage the WebSocket connection.
export const WebSocketContext = createContext<WebSocket | null>(null);

// Custom hook to access the WebSocket context.
export const useWebSocket = (): WebSocket | null => {
  return useContext(WebSocketContext);
};

// WebSocketProvider component for managing the WebSocket connection.
export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { addPost, deletePost, likePost, dislikePost, updateTotalComments } = usePostsStore();
  const { addNotification } = useNotificationsStore();

  useEffect(() => {
    // Create a new WebSocket connection with a token.
    const newSocket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws/?token=${getAccessTokenFromClient()}`);
    setSocket(newSocket);

    // Check if the WebSocket connection is open and set up event handling.
    if (newSocket.readyState === 0) {
      setupWebSocket(
        newSocket,
        addPost,
        deletePost,
        likePost,
        dislikePost,
        addNotification,
        updateTotalComments
      );
    }

    // Clean up the WebSocket connection when the component unmounts.
    return () => {
      if (newSocket.readyState === 1) {
        newSocket.close();
      }
    };
  }, []);


  return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>;
};
