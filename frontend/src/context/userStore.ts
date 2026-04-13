import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '../types';

export interface UserContext {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  user: UserContext | null;
  isAuthenticated: boolean;
  login: (userData: UserContext, token: string, refreshToken?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData, token, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', token);
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }
        }
        set({ user: userData, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // unique name
    }
  )
);
