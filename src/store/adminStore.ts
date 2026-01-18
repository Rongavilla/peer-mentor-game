import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminSession {
  id: string;
  username: string;
  role: string;
  loginTime: string;
}

interface AdminStore {
  admin: AdminSession | null;
  isAuthenticated: boolean;
  setAdmin: (admin: AdminSession) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      setAdmin: (admin) =>
        set({
          admin,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          admin: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'admin-store',
    }
  )
);
