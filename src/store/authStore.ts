import { create } from "zustand";
import { storage, STORAGE_KEYS } from "../utils/storage";

export type UserRole = "coordinator" | "teacher" | "student" | "representative";

interface User {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  position?: string;
}

interface AuthState {
  users: User[];
  currentUsers: Record<UserRole, User | null>;
  isAuthenticated: Record<UserRole, boolean>;
  login: (role: UserRole, email: string, password: string) => boolean;
  register: (user: Omit<User, "">) => boolean;
  logout: (role: UserRole) => void;
}

const getInitialUsers = (): User[] => {
  const stored = storage.get<User[]>(STORAGE_KEYS.USERS, []);
  if (stored.length === 0) {
    // Default system users if none exist
    const defaults: User[] = [
      {
        email: "admin@classhub.edu",
        password: "1234",
        role: "coordinator",
        fullName: "Admin Coordinator",
      },
      {
        email: "teacher1@classhub.edu",
        password: "2345",
        role: "teacher",
        fullName: "John Doe",
        position: "Professor",
      },
      {
        email: "student1@classhub.edu",
        password: "4567",
        role: "student",
        fullName: "Jane Smith",
      },
      {
        email: "rep1@classhub.edu",
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

const getInitialCurrentUsers = (): Record<UserRole, User | null> => {
  return storage.get<Record<UserRole, User | null>>(`current_user_sessions`, {
    coordinator: null,
    teacher: null,
    student: null,
    representative: null,
  });
};

export const useAuthStore = create<AuthState>((set) => ({
  users: getInitialUsers(),
  currentUsers: getInitialCurrentUsers(),
  isAuthenticated: getInitialAuthState(),

  login: (role, email, password) => {
    const users = getInitialUsers();
    const user = users.find(
      (u) =>
        u.email === email && u.password === password && u.role === role,
    );

    if (user) {
      set((state) => {
        const nextAuth = { ...state.isAuthenticated, [role]: true };
        const nextUsers = { ...state.currentUsers, [role]: user };
        storage.set(STORAGE_KEYS.AUTH_STATE, nextAuth);
        storage.set(`current_user_sessions`, nextUsers);
        return {
          isAuthenticated: nextAuth,
          currentUsers: nextUsers,
        };
      });
      return true;
    }
    return false;
  },

  register: (newUser) => {
    const users = getInitialUsers();
    if (users.find((u) => u.email === newUser.email)) {
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
      const nextUsers = { ...state.currentUsers, [role]: null };
      storage.set(STORAGE_KEYS.AUTH_STATE, nextAuth);

      const hasActiveSession = Object.values(nextAuth).some(Boolean);
      if (!hasActiveSession) {
        storage.remove(`current_user_sessions`);
      } else {
        storage.set(`current_user_sessions`, nextUsers);
      }

      return {
        isAuthenticated: nextAuth,
        currentUsers: nextUsers,
      };
    }),
}));
