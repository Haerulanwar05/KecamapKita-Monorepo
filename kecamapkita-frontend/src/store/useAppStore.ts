import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id?: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  totalXp: number;
  level: number;
  history: any[];
}

interface AppState {
  currentUser: User | null;
  guestHistory: any[];
  activeWeather: string;
  activeVibe: string;
  activeKecamatan: string;
  theme: 'light' | 'dark';
  setCurrentUser: (user: User | null) => void;
  addGuestHistory: (record: any) => void;
  clearGuestHistory: () => void;
  setActiveWeather: (weather: string) => void;
  setActiveVibe: (vibe: string) => void;
  setActiveKecamatan: (kecamatan: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  mergeGuestHistory: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      guestHistory: [],
      activeWeather: 'clear',
      activeVibe: 'all',
      activeKecamatan: 'Menteng',
      theme: 'light',
      
      setCurrentUser: (user) => set({ currentUser: user }),
      addGuestHistory: (record) => set((state) => ({ guestHistory: [...state.guestHistory, record] })),
      clearGuestHistory: () => set({ guestHistory: [] }),
      setActiveWeather: (weather) => set({ activeWeather: weather }),
      setActiveVibe: (vibe) => set({ activeVibe: vibe }),
      setActiveKecamatan: (kecamatan) => set({ activeKecamatan: kecamatan }),
      setTheme: (theme) => set({ theme }),
      
      mergeGuestHistory: async () => {
        const { currentUser, guestHistory, clearGuestHistory } = get();
        if (currentUser && guestHistory.length > 0) {
            // Pseudo API sync integration
            console.log("Syncing guest history to cloud for user:", currentUser.username);
            clearGuestHistory();
        }
      }
    }),
    {
      name: 'kecamapkita-storage',
    }
  )
);
