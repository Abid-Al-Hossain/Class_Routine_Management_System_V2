import { create } from "zustand";
import { storage, STORAGE_KEYS } from "../utils/storage";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  fetchMessages: () => void;
  addMessage: (sender: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: storage.get(STORAGE_KEYS.MESSAGES, []),

  fetchMessages: () => {
    set({ messages: storage.get(STORAGE_KEYS.MESSAGES, []) });
  },

  addMessage: (sender, content) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      content,
      timestamp: new Date(),
    };
    set((state) => {
      const nextMessages = [...state.messages, newMessage];
      storage.set(STORAGE_KEYS.MESSAGES, nextMessages);
      return { messages: nextMessages };
    });
  },

  deleteMessage: (messageId) => {
    set((state) => {
      const nextMessages = state.messages.filter((msg) => msg.id !== messageId);
      storage.set(STORAGE_KEYS.MESSAGES, nextMessages);
      return { messages: nextMessages };
    });
  },
}));
