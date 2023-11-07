import { Notification } from "@/types/notifications_types";
import { create } from "zustand";

interface NotificationsState {
    notifications: Notification[];
    initializeNotifications: (newNotifications: Notification[]) => void;
    addNotification: (newNotification: Notification) => void;
    removeNotifications: (id: number) => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
    notifications: [], // Initialize the notifications array.

    initializeNotifications: (newNotifications) => {
        set({ notifications: newNotifications }); // Initialize notifications with new data.
    },

    // Add new notification
    addNotification: (newNotification) => {
        set((state) => ({
            notifications: [newNotification, ...state.notifications],
        }));
    },

    removeNotifications: (id) => {
        set((state) => {
            // Filter out the notifications with the specified 'id'.
            const updatedNotifications = state.notifications.filter(notification => notification.id !== id);
            return {
                ...state,
                notifications: updatedNotifications,
            };
        });
    }
    
}))