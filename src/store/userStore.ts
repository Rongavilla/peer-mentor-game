import { create } from 'zustand';
import { UserProfile, UserStatus } from '@/types';

interface UserStore {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setStatus: (status: UserStatus) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),
  setStatus: (status) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, status } : null,
    })),
  logout: () => set({ profile: null }),
}));
