'use client';

import { usePostsStore } from '@/lib/store/posts_store';
import { setupWebSocket } from '@/utils/_ws_messages';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext<WebSocket | null>(null);

export const useWebSocket = (): WebSocket | null => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { addPost, deletePost, likePost, dislikePost, updateTotalComments } = usePostsStore();

  useEffect(() => {
    const newSocket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws/`);
    setSocket(newSocket);

    if (newSocket.readyState === 0) {
      setupWebSocket(
        newSocket,
        addPost,
        deletePost,
        likePost,
        dislikePost,
        updateTotalComments
      );
    }

    return () => {
      if (newSocket.readyState === 1) {
        newSocket.close();
      }
    };
  }, [addPost, deletePost, likePost, dislikePost, updateTotalComments]);

  return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>;
};
