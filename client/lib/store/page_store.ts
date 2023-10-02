import { create } from "zustand";

interface PageState {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const useHomeStore = create<PageState>((set) => ({
  currentPage: 1,

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },
}));

export const useUserStore = create<PageState>((set) => ({
  currentPage: 1,

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },
}));

export const useHobbiesStore = create<PageState>((set) => ({
  currentPage: 1,

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },
}));
