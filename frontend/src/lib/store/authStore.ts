import { create } from 'zustand';
import Cookies from 'js-cookie';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string; role?: string }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const data = await authApi.login(email, password);
    Cookies.set('access_token', data.accessToken, { expires: 1 / 24 });
    Cookies.set('refresh_token', data.refreshToken, { expires: 7 });
    set({ user: data.user, isAuthenticated: true, isLoading: false });
  },

  register: async (formData) => {
    const data = await authApi.register(formData);
    Cookies.set('access_token', data.accessToken, { expires: 1 / 24 });
    Cookies.set('refresh_token', data.refreshToken, { expires: 7 });
    set({ user: data.user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  loadUser: async () => {
    const token = Cookies.get('access_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const user = await authApi.getProfile();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
