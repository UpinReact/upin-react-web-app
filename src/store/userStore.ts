import { create } from 'zustand'; // Correct import
import { persist, PersistOptions } from 'zustand/middleware';

export interface UserStore {
    user: {
        email?: string;
        access_token?: string;
        refresh_token?: string;
        id: number;
    };
    setUser: (user: { email?: string; access_token: string; refresh_token: string; id: number }) => void;
}

const useUserStore = create<UserStore, [['zustand/persist', UserStore]]>(
    persist<UserStore>(
        (set) => ({
            user: { email: '', access_token: '', refresh_token: '', id: 0 },
            setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
        }),
        {
            name: 'user-storage', // name of the item in the storage (optional)
        } as PersistOptions<UserStore>
    )
);
    
export { useUserStore };
