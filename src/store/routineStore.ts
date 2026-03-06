import { create } from "zustand";
import { storage, STORAGE_KEYS } from "../utils/storage";

interface ScheduleChangeRequest {
  id: string;
  teacherName: string;
  content: string;
  timestamp: Date;
  acceptStatus: "pending" | "accepted" | "rejected";
}

interface RoutineState {
  routine: Record<string, any>;
  requests: ScheduleChangeRequest[];
  fetchRoutine: () => void;
  saveRoutine: (day: string, routineData: any) => void;
  clearRoutine: () => void;
  fetchRequests: () => void;
  addRequest: (teacherName: string, content: string) => void;
  deleteRequest: (id: string) => void;
  updateRequest: (id: string, content: string) => void;
  acceptRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
}

export const useRoutineStore = create<RoutineState>((set) => ({
  routine: storage.get(STORAGE_KEYS.ROUTINES, {}),
  requests: storage.get(STORAGE_KEYS.REQUESTS, []),

  fetchRoutine: () => {
    set({ routine: storage.get(STORAGE_KEYS.ROUTINES, {}) });
  },

  saveRoutine: (day, routineData) => {
    set((state) => {
      const nextRoutine = { ...state.routine, [day]: routineData };
      storage.set(STORAGE_KEYS.ROUTINES, nextRoutine);
      return { routine: nextRoutine };
    });
  },

  clearRoutine: () => {
    storage.set(STORAGE_KEYS.ROUTINES, {});
    set({ routine: {} });
  },

  fetchRequests: () => {
    set({ requests: storage.get(STORAGE_KEYS.REQUESTS, []) });
  },

  addRequest: (teacherName, content) => {
    const newRequest: ScheduleChangeRequest = {
      id: Math.random().toString(36).substr(2, 9),
      teacherName,
      content,
      timestamp: new Date(),
      acceptStatus: "pending",
    };
    set((state) => {
      // Ensure newest are at the top (index 0)
      const nextRequests = [newRequest, ...state.requests];
      storage.set(STORAGE_KEYS.REQUESTS, nextRequests);
      return { requests: nextRequests };
    });
  },

  deleteRequest: (id) => {
    set((state) => {
      const nextRequests = state.requests.filter((req) => req.id !== id);
      storage.set(STORAGE_KEYS.REQUESTS, nextRequests);
      return { requests: nextRequests };
    });
  },

  updateRequest: (id, content) => {
    set((state) => {
      const nextRequests = state.requests.map((req) =>
        req.id === id ? { ...req, content, timestamp: new Date() } : req,
      );
      storage.set(STORAGE_KEYS.REQUESTS, nextRequests);
      return { requests: nextRequests };
    });
  },

  acceptRequest: (id) => {
    set((state) => {
      const nextRequests = state.requests.map((req) =>
        req.id === id ? { ...req, acceptStatus: "accepted" as const } : req,
      );
      storage.set(STORAGE_KEYS.REQUESTS, nextRequests);
      return { requests: nextRequests };
    });
  },

  rejectRequest: (id) => {
    set((state) => {
      const nextRequests = state.requests.map((req) =>
        req.id === id ? { ...req, acceptStatus: "rejected" as const } : req,
      );
      storage.set(STORAGE_KEYS.REQUESTS, nextRequests);
      return { requests: nextRequests };
    });
  },
}));
