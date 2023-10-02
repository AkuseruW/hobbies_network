import { create } from "zustand";
import { useCallback, useEffect } from "react";
import { usePostsStore } from "./posts_store";
import { setupWebSocket } from "@/utils/_ws_messages";

// Define an interface for the state
interface WebSocketState {
  socket: WebSocket | null;
}

const useWebSocketStore = create<WebSocketState>((set) => ({
  socket: null,
}));

export const useWebSocket = () => {
  const { socket } = useWebSocketStore.getState();

  const { addPost, deletePost, likePost, dislikePost, updateTotalComments } =
    usePostsStore.getState();

  const initializeWebSocket = useCallback(() => {
    const newSocket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws/`);

    newSocket.addEventListener("open", () => {
      setupWebSocket(
        newSocket,
        addPost,
        deletePost,
        likePost,
        dislikePost,
        updateTotalComments
      );
    });

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, [addPost, deletePost, likePost, dislikePost, updateTotalComments]);

  useEffect(() => {
    if (socket === null) {
      const cleanupWebSocket = initializeWebSocket();
      return () => {
        cleanupWebSocket();
      };
    }
  }, [socket, initializeWebSocket]);

  return socket;
};
