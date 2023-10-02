import { create } from "zustand";

interface LikeState {
  likedPosts: string[];
  initializeLikedPosts: (initialPosts: string[]) => void;
  setLikedPosts: (likedPosts: string[]) => void;
}

export const useLikeStore = create<LikeState>((set) => ({
  likedPosts: [],

  initializeLikedPosts: (initialLikedPosts) => {
    set({ likedPosts: initialLikedPosts });
  },

  setLikedPosts: (likedPosts) => set({ likedPosts }),
}));
