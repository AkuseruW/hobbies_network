import { Hobby } from "@/types/hobby_types";
import { create } from "zustand";

interface HobbiesState {
  hobbies: Hobby[];
  addOrRemoveHobby: (id: number) => void;
  setHobbies: (newHobbies: Hobby[]) => void;
  setNewHobbies: (newHobbies: Hobby[]) => void;
}

export const useHobbiesStore = create<HobbiesState>((set) => ({
  hobbies: [],

  addOrRemoveHobby: (id) => {
    set((state) => {
      const updatedHobbies = state.hobbies.map((hobby) => {
        if (hobby.id === id) {
          return {
            ...hobby,
            added: !hobby.added,
          };
        }
        return hobby;
      });

      return { hobbies: updatedHobbies };
    });
  },

  setHobbies: (newHobbies) => {
    set({ hobbies: newHobbies });
  },

  setNewHobbies: (newHobbies) => {
    set((state) => ({
      hobbies: [
        ...state.hobbies,
        ...newHobbies.map((hobby) => ({
          ...hobby,
        })),
      ],
    }));
  },
}));
