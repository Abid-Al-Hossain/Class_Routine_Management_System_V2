import { create } from "zustand";
import { storage, STORAGE_KEYS } from "../utils/storage";
import { UserRole } from "./authStore";

interface Notification {
  id: string;
  content: string;
  sender: string;
  senderRole?: UserRole | "System" | "all";
  targetRole?: UserRole | "all";
  timestamp: Date;
  readBy: string[]; // Array of usernames who have read this
}

interface NotificationState {
  notifications: Notification[];
  fetchNotifications: (role?: UserRole, userName?: string) => void;
  addNotification: (
    content: string,
    sender: string,
    senderRole?: UserRole | "System" | "all",
    targetRole?: UserRole | "all",
  ) => void;
  deleteNotification: (id: string) => void;
  updateNotification: (id: string, content: string) => void;
  markAsRead: (id: string, userName: string) => void;
  markAsUnread: (id: string, userName: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: storage.get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []).map(n => ({
    ...n,
    readBy: n.readBy || []
  })),

  fetchNotifications: (role, userName) => {
    const allNotifs = storage.get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []).map(n => ({
      ...n,
      readBy: n.readBy || []
    }));
    if (!role || role === "coordinator") {
      set({ notifications: allNotifs });
      return;
    }
    // Filter by role or "all" or if the current user is the sender
    // ALSO allow users to see notifications sent by their peers (same role)
    const filtered = allNotifs.filter(
      (n) =>
        n.targetRole === "all" ||
        n.targetRole === role ||
        !n.targetRole ||
        (userName && n.sender === userName) ||
        n.senderRole === role,
    );
    set({ notifications: filtered });
  },

  addNotification: (content, sender, senderRole = "System", targetRole = "all") => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      sender,
      senderRole,
      targetRole,
      timestamp: new Date(),
      readBy: [],
    };
    const allNotifs = storage.get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []).map(n => ({
      ...n,
      readBy: n.readBy || []
    }));
    // Ensure newest are at the top (index 0)
    const nextNotifs = [newNotif, ...allNotifs];
    storage.set(STORAGE_KEYS.NOTIFICATIONS, nextNotifs);
    set({ notifications: nextNotifs });
  },

  deleteNotification: (id) => {
    const allNotifs = storage.get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []).map(n => ({
      ...n,
      readBy: n.readBy || []
    }));
    const nextLocalStr = allNotifs.filter((n) => n.id !== id);
    storage.set(STORAGE_KEYS.NOTIFICATIONS, nextLocalStr);

    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  updateNotification: (id, content) => {
    const allNotifs = storage.get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []).map(n => ({
      ...n,
      readBy: n.readBy || []
    }));
    const nextNotifs = allNotifs.map((n) =>
      n.id === id ? { ...n, content, timestamp: new Date() } : n,
    );
    storage.set(STORAGE_KEYS.NOTIFICATIONS, nextNotifs);
    set({ notifications: nextNotifs });
  },

  markAsRead: (id, userName) => {
    const allNotifs = storage.get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []).map(n => ({
      ...n,
      readBy: n.readBy || []
    }));
    const nextNotifs = allNotifs.map((n) => {
      if (n.id === id && !n.readBy.includes(userName)) {
        return { ...n, readBy: [...n.readBy, userName] };
      }
      return n;
    });
    storage.set(STORAGE_KEYS.NOTIFICATIONS, nextNotifs);
    set({ notifications: nextNotifs });
  },

  markAsUnread: (id, userName) => {
    const allNotifs = storage.get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []).map(n => ({
      ...n,
      readBy: n.readBy || []
    }));
    const nextNotifs = allNotifs.map((n) => {
      if (n.id === id) {
        return { ...n, readBy: n.readBy.filter((u) => u !== userName) };
      }
      return n;
    });
    storage.set(STORAGE_KEYS.NOTIFICATIONS, nextNotifs);
    set({ notifications: nextNotifs });
  },
}));
