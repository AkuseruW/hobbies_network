'use client'
import { useEffect, useCallback, createContext, ReactNode, useContext } from 'react';
import { useUserHobbiesStore } from '@/lib/store/hobbies_store';
import { getUserHobbies } from '@/utils/requests/_users_requests';
import { Hobby } from '@/types/hobby_types';
import { useNotificationsStore } from '@/lib/store/notifications_store';
import { getNotifications } from '@/utils/requests/_notifications_requests';
import { WebSocketContext } from './ws_provider';

export const userHobbiesContext = createContext<Hobby[] | undefined>([]);

export const UserHobbiesProvider = ({ children }: { children: ReactNode }) => {
  const { initializeUserHobbiesSelected } = useUserHobbiesStore();
  const { initializeNotifications, addNotification } = useNotificationsStore();
  const socket = useContext(WebSocketContext);


  const getUserInfo = useCallback(async () => {
    const hobbiesSelected = await getUserHobbies();
    const { notifications } = await getNotifications();
    initializeUserHobbiesSelected(hobbiesSelected);
    initializeNotifications(notifications);
  }, [initializeUserHobbiesSelected, initializeNotifications]);


  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const receivedEvent = JSON.parse(event.data);
        switch (receivedEvent.action) {
          case "notification":
            addNotification(receivedEvent.data);
        }
      }
    }
  }, [socket])


  return (
    // @ts-ignore
    <userHobbiesContext.Provider value={initializeUserHobbiesSelected, initializeNotifications}>
      {children}
    </userHobbiesContext.Provider>
  );
};
