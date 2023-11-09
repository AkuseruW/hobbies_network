"use client";
import React, { useEffect, useCallback, createContext, ReactNode } from "react";
import { useUserHobbiesStore } from "@/lib/store/hobbies_store";
import { getUserHobbies } from "@/utils/requests/_users_requests";
import { useNotificationsStore } from "@/lib/store/notifications_store";
import { getNotifications } from "@/utils/requests/_notifications_requests";

export const userContext = createContext({}); // Create context for user data

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { initializeUserHobbiesSelected, hobbiesSelected } =
    useUserHobbiesStore();
  const { initializeNotifications, notifications, addNotification } =
    useNotificationsStore();

  const getUserInfo = useCallback(async () => {
    try {
      const hobbiesSelected = await getUserHobbies(); // Fetch hobbies
      const { notifications } = await getNotifications(); // Fetch notifications
      initializeUserHobbiesSelected(hobbiesSelected); // Initialize hobbies with new data
      initializeNotifications(notifications); // Initialize notifications with new data
    } catch (error) {
      console.error(error);
    }
  }, [initializeUserHobbiesSelected, initializeNotifications]);

  useEffect(() => {
    getUserInfo(); // Get user info
  }, [getUserInfo]);

  return (
    <userContext.Provider value={{ hobbiesSelected, notifications }}>
      {children}
    </userContext.Provider>
  );
};
