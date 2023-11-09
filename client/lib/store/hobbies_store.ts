import { Hobby } from "@/types/hobby_types";
import { create } from "zustand";

interface HobbiesState {
  hobbies: Hobby[];
  currentPage: number;
  isEndOfList: boolean;
  initializeHobbies: (newHobbies: Hobby[]) => void;
  setHobbies: (newHobbies: Hobby[]) => void;
  incrementCurrentPage: () => void;
  changeIsEndOfList: () => void;
}

export const useHobbiesStore = create<HobbiesState>((set) => ({
  hobbies: [], // Initialize the hobbies array.
  currentPage: 2, // Initialize the current page to 2.
  isEndOfList: false, // Initialize the end of list status.

  initializeHobbies: (newHobbies) => {
    set({ hobbies: newHobbies }); // Initialize hobbies with new data.
  },

  setHobbies: (newHobbies) => {
    // Set the list of hobbies by merging new hobbies with the existing list.
    set((state) => ({ hobbies: [...state.hobbies, ...newHobbies] }));
  },

  incrementCurrentPage: () => {
    // Increment the current page by 1.
    set((state) => ({ currentPage: state.currentPage + 1 }));
  },

  changeIsEndOfList: () => {
    // Change the end of list status.
    set((state) => ({ isEndOfList: state.isEndOfList ? false : true }));
  }
}));


interface UserHobbiesState {
  hobbiesSelected: Hobby[];
  initializeUserHobbiesSelected: (hobbies: Hobby[]) => void;
  toggleHobby: (hobby: Hobby) => void;
}

export const useUserHobbiesStore = create<UserHobbiesState>((set) => ({
  hobbiesSelected: [], // Initialize the selected hobbies array.

  initializeUserHobbiesSelected: (hobbies) => {
    // Initialize the selected hobbies array.
    set({ hobbiesSelected: hobbies });
  },

  // Add or remove a hobby by its ID.
  toggleHobby: (hobby) => {
    set((state) => {
      const isAlreadySelected = state.hobbiesSelected.some((selectedHobby) => selectedHobby.id === hobby.id);
      const newHobbiesSelected = isAlreadySelected
        ? state.hobbiesSelected.filter((selectedHobby) => selectedHobby.id !== hobby.id)
        : [...state.hobbiesSelected, hobby];
  
      return { hobbiesSelected: newHobbiesSelected };
    });
  },
  

}));