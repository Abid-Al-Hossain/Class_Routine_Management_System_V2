import { create } from "zustand";
import { storage, STORAGE_KEYS } from "../utils/storage";
import { UserRole } from "./authStore";

interface Notification {
  id: string;
  content: string;
  sender: string;
  targetRole?: UserRole | "all";
  timestamp: Date;
}

interface NotificationState {
  notifications: Notification[];
  fetchNotifications: (role?: UserRole) => void;
  addNotification: (
    content: string,
    sender: string,
    targetRole?: UserRole | "all",
  ) => void;
  deleteNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: storage.get(STORAGE_KEYS.NOTIFICATIONS, []),

  fetchNotifications: (role) => {
    const allNotifs = storage.get<Notification[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      [],
    );
    if (!role) {
      set({ notifications: allNotifs });
      return;
    }
    // Filter by role or "all"
    const filtered = allNotifs.filter(
      (n) => n.targetRole === "all" || n.targetRole === role || !n.targetRole,
    );
    set({ notifications: filtered });
  },

  addNotification: (content, sender, targetRole = "all") => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      sender,
      targetRole,
      timestamp: new Date(),
    };
    const allNotifs = storage.get<Notification[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      [],
    );
    const nextNotifs = [newNotif, ...allNotifs];
    storage.set(STORAGE_KEYS.NOTIFICATIONS, nextNotifs);
    set({ notifications: nextNotifs });
  },

  deleteNotification: (id) => {
    const allNotifs = storage.get<Notification[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      [],
    );
    const nextLocalStr = allNotifs.filter((n) => n.id !== id);
    storage.set(STORAGE_KEYS.NOTIFICATIONS, nextLocalStr);

    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));
