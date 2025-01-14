import {create} from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  user: any; // You can replace `any` with a more specific type for your user object
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (user: any, accessToken: string, refreshToken: string) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState, [['zustand/persist', SessionState]]>(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setSession: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),
      clearSession: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'session-storage', // name of the item in the storage (optional)
    }
  )
);