import { create } from "zustand";
import { storage, STORAGE_KEYS } from "../utils/storage";

export type ChatChannel = "general" | "faculty" | "students" | "coordinators";

interface Message {
  id: string;
  sender: string;
  content: string;
  channel: ChatChannel;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  fetchMessages: (channel?: ChatChannel) => void;
  addMessage: (sender: string, content: string, channel?: ChatChannel) => void;
  deleteMessage: (messageId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: storage.get(STORAGE_KEYS.MESSAGES, []),

  fetchMessages: (channel) => {
    const allMessages = storage.get<Message[]>(STORAGE_KEYS.MESSAGES, []);
    if (!channel) {
      set({ messages: allMessages });
      return;
    }
    const filtered = allMessages.filter((msg) => msg.channel === channel);
    set({ messages: filtered });
  },

  addMessage: (sender, content, channel = "general") => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      content,
      channel,
      timestamp: new Date(),
    };
    const allMessages = storage.get<Message[]>(STORAGE_KEYS.MESSAGES, []);
    const nextMessages = [...allMessages, newMessage];
    storage.set(STORAGE_KEYS.MESSAGES, nextMessages);
    set({ messages: nextMessages });
  },

  deleteMessage: (messageId) => {
    const allMessages = storage.get<Message[]>(STORAGE_KEYS.MESSAGES, []);
    const nextLocalStr = allMessages.filter((msg) => msg.id !== messageId);
    storage.set(STORAGE_KEYS.MESSAGES, nextLocalStr);

    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== messageId),
    }));
  },
}));
