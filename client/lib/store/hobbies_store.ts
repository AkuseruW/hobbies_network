import { Hobby } from "@/types/hobby_types";
import { create } from "zustand";

interface HobbiesState {
  hobbies: Hobby[];
  initializeHobbies: (newHobbies: Hobby[]) => void;
  setHobbies: (newHobbies: Hobby[]) => void;
}

export const useHobbiesStore = create<HobbiesState>((set) => ({
  hobbies: [],

  initializeHobbies: (newHobbies) => {
    set({ hobbies: newHobbies });
  },

  setHobbies: (newHobbies) => {
    set((state) => ({ hobbies: [...state.hobbies, ...newHobbies] }));
  },
}));


interface UserHobbiesState {
  hobbiesSelected: Hobby[];
  initializeUserHobbiesSelected: (hobbies: Hobby[]) => void;
  toggleHobby: (id: number) => void;
}

export const useUserHobbiesStore = create<UserHobbiesState>((set) => ({
  hobbiesSelected: [],

  initializeUserHobbiesSelected: (hobbies) => {
    set({ hobbiesSelected: hobbies });
  },

  toggleHobby: (id) => {
    // @ts-ignore
    set((state) => {
      const isAlreadySelected = state.hobbiesSelected.some((hobby) => hobby.id === id);
      const newHobbiesSelected = isAlreadySelected
        ? state.hobbiesSelected.filter((hobby) => hobby.id !== id)
        : [...state.hobbiesSelected, { id }];

      return { hobbiesSelected: newHobbiesSelected };
    });
  },

}));