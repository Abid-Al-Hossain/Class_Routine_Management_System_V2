import { create } from "zustand";
import { storage, STORAGE_KEYS } from "../utils/storage";

interface Notification {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

interface NotificationState {
  notifications: Notification[];
  fetchNotifications: () => void;
  addNotification: (content: string, sender: string) => void;
  deleteNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: storage.get(STORAGE_KEYS.NOTIFICATIONS, []),

  fetchNotifications: () => {
    set({ notifications: storage.get(STORAGE_KEYS.NOTIFICATIONS, []) });
  },

  addNotification: (content, sender) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      sender,
      timestamp: new Date(),
    };
    set((state) => {
      const nextNotifs = [newNotif, ...state.notifications];
      storage.set(STORAGE_KEYS.NOTIFICATIONS, nextNotifs);
      return { notifications: nextNotifs };
    });
  },

  deleteNotification: (id) => {
    set((state) => {
      const nextNotifs = state.notifications.filter((n) => n.id !== id);
      storage.set(STORAGE_KEYS.NOTIFICATIONS, nextNotifs);
      return { notifications: nextNotifs };
    });
  },
}));
