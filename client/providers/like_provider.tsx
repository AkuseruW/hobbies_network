'use client';
import React, { createContext, useContext, useState } from 'react';

interface LikeContextType {
  likedPosts: Set<string>;
  toggleLike: (postId: string) => void;
}

const initialContext: LikeContextType = {
  likedPosts: new Set<string>(),
  toggleLike: () => { },
};

const LikeContext = createContext<LikeContextType>(initialContext);

export function LikeProvider({ children }: { children: React.ReactNode }) {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(initialContext.likedPosts);

  const toggleLike = (postId: string) => {
    setLikedPosts((prevLikedPosts) => {
      const newLikedPosts = new Set(prevLikedPosts);
      if (newLikedPosts.has(postId)) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }
      return newLikedPosts;
    });
  };

  return (
    <LikeContext.Provider value={{ likedPosts, toggleLike }}>
      {children}
    </LikeContext.Provider>
  );
}

export function useLike() {
  return useContext(LikeContext);
}
