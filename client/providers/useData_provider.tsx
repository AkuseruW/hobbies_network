"use client";
import React, { useEffect, useCallback, createContext, ReactNode } from "react";
import { useUserHobbiesStore } from "@/lib/store/hobbies_store";
import { getUserHobbies } from "@/utils/requests/_users_requests";
import { Hobby } from "@/types/hobby_types";
import { useNotificationsStore } from "@/lib/store/notifications_store";
import { getNotifications } from "@/utils/requests/_notifications_requests";
import { Notification } from "@/types/notifications_types";

export const userContext = createContext({});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { initializeUserHobbiesSelected, hobbiesSelected } =
    useUserHobbiesStore();
  const { initializeNotifications, notifications, addNotification } =
    useNotificationsStore();

  const getUserInfo = useCallback(async () => {
    try {
      const hobbiesSelected = await getUserHobbies();
      const { notifications } = await getNotifications();
      initializeUserHobbiesSelected(hobbiesSelected);
      initializeNotifications(notifications);
    } catch (error) {
      // Gérer les erreurs ici
    }
  }, [initializeUserHobbiesSelected, initializeNotifications]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <userContext.Provider value={{ hobbiesSelected, notifications }}>
      {children}
    </userContext.Provider>
  );
};
