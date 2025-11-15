type Store = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

const memory = new Map<string, string>();

const webStorage = typeof window !== 'undefined' && window?.localStorage
  ? {
      async getItem(key: string) { return window.localStorage.getItem(key); },
      async setItem(key: string, value: string) { window.localStorage.setItem(key, value); },
      async removeItem(key: string) { window.localStorage.removeItem(key); }
    }
  : null;

export const storage: Store = webStorage ?? {
  async getItem(key: string) { return memory.has(key) ? memory.get(key)! : null; },
  async setItem(key: string, value: string) { memory.set(key, value); },
  async removeItem(key: string) { memory.delete(key); }
};
