const STORAGE_KEYS = {
  USERS: "crm_users",
  ROUTINES: "crm_routines",
  MESSAGES: "crm_messages",
  NOTIFICATIONS: "crm_notifications",
  REQUESTS: "crm_requests",
  AUTH_STATE: "crm_auth_state",
};

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  },

  set: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  update: <T>(key: string, updater: (prev: T) => T, defaultValue: T): void => {
    const prev = storage.get(key, defaultValue);
    const next = updater(prev);
    storage.set(key, next);
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },
};

export { STORAGE_KEYS };
