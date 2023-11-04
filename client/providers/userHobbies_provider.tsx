'use client'
import { useEffect, useCallback, createContext, ReactNode } from 'react';
import { useUserHobbiesStore } from '@/lib/store/hobbies_store';
import { getUserHobbies } from '@/utils/requests/_users_requests';
import { Hobby } from '@/types/hobby_types';

export const userHobbiesContext = createContext<Hobby[] | undefined>([]);

export const UserHobbiesProvider = ({ children }: { children: ReactNode }) => {
  const { initializeUserHobbiesSelected } = useUserHobbiesStore();

  const getUserHobbiesSelected = useCallback(async () => {
    const data = await getUserHobbies();
    initializeUserHobbiesSelected(data);
  }, [initializeUserHobbiesSelected]);

  useEffect(() => {
    getUserHobbiesSelected();
  }, [getUserHobbiesSelected]);

  return (
    // @ts-ignore
    <userHobbiesContext.Provider value={initializeUserHobbiesSelected}>
      {children}
    </userHobbiesContext.Provider>
  );
};
