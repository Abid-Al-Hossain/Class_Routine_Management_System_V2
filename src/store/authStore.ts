import { create } from "zustand";
import { storage, STORAGE_KEYS } from "../utils/storage";

export type UserRole = "coordinator" | "teacher" | "student" | "representative";

interface User {
  username: string;
  password: string;
  role: UserRole;
  fullName: string;
}

interface AuthState {
  users: User[];
  currentUser: User | null;
  isAuthenticated: Record<UserRole, boolean>;
  login: (role: UserRole, username: string, password: string) => boolean;
  register: (user: Omit<User, "">) => boolean;
  logout: (role: UserRole) => void;
}

const getInitialUsers = (): User[] => {
  const stored = storage.get<User[]>(STORAGE_KEYS.USERS, []);
  if (stored.length === 0) {
    // Default system users if none exist
    const defaults: User[] = [
      {
        username: "admin",
        password: "1234",
        role: "coordinator",
        fullName: "Admin Coordinator",
      },
      {
        username: "teacher1",
        password: "2345",
        role: "teacher",
        fullName: "John Doe",
      },
      {
        username: "student1",
        password: "4567",
        role: "student",
        fullName: "Jane Smith",
      },
      {
        username: "rep1",
        password: "5678",
        role: "representative",
        fullName: "Alice Brown",
      },
    ];
    storage.set(STORAGE_KEYS.USERS, defaults);
    return defaults;
  }
  return stored;
};

const getInitialAuthState = (): Record<UserRole, boolean> => {
  return storage.get<Record<UserRole, boolean>>(STORAGE_KEYS.AUTH_STATE, {
    coordinator: false,
    teacher: false,
    student: false,
    representative: false,
  });
};

const getInitialCurrentUser = (): User | null => {
  // Read current user from storage if available, otherwise null
  return storage.get<User | null>(`current_user_session`, null);
};

export const useAuthStore = create<AuthState>((set) => ({
  users: getInitialUsers(),
  currentUser: getInitialCurrentUser(),
  isAuthenticated: getInitialAuthState(),

  login: (role, username, password) => {
    const users = getInitialUsers();
    const user = users.find(
      (u) =>
        u.username === username && u.password === password && u.role === role,
    );

    if (user) {
      set((state) => {
        const nextAuth = { ...state.isAuthenticated, [role]: true };
        storage.set(STORAGE_KEYS.AUTH_STATE, nextAuth);
        storage.set(`current_user_session`, user);
        return {
          isAuthenticated: nextAuth,
          currentUser: user,
        };
      });
      return true;
    }
    return false;
  },

  register: (newUser) => {
    const users = getInitialUsers();
    if (users.find((u) => u.username === newUser.username)) {
      return false; // User already exists
    }
    const updatedUsers = [...users, newUser];
    storage.set(STORAGE_KEYS.USERS, updatedUsers);
    set({ users: updatedUsers });
    return true;
  },

  logout: (role) =>
    set((state) => {
      const nextAuth = { ...state.isAuthenticated, [role]: false };
      storage.set(STORAGE_KEYS.AUTH_STATE, nextAuth);

      // If there are no other active sessions, clear currentUser
      const hasActiveSession = Object.values(nextAuth).some(Boolean);
      if (!hasActiveSession) {
        storage.remove(`current_user_session`);
      }

      return {
        isAuthenticated: nextAuth,
        currentUser: hasActiveSession ? state.currentUser : null,
      };
    }),
}));
