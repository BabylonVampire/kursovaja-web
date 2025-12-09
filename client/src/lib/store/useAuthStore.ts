import { api } from '@/lib/api';
import type { TAuthStore, TToken } from '@/lib/types';
import { ACCESS_TOKEN_KEY, USER_TOKEN_KEY } from '@/lib/constants';
import { create } from 'zustand';

export const useAuthStore = create<TAuthStore>()((set) => ({
  isAuthorized: false,
  setIsAuthorized: (value: boolean) => set(() => ({ isAuthorized: value })),
  isLoading: false,
  isError: false,
  userData: null,
  getTokens: async () => {
    const PREFIX = import.meta.env.PREFIX ?? 'apiv1';

    const response = await api.post<TToken>(`/${PREFIX}/auth/refresh`, {});

    localStorage.setItem(ACCESS_TOKEN_KEY, response?.data.accessToken || '');
  },
  login: async ({ email, password }: { email: string; password: string }) => {
    const PREFIX = import.meta.env.PREFIX ?? 'apiv1';
    set({ isLoading: true });
    const response = await api
      .post(`/${PREFIX}/auth/signIn`, {
        email,
        password,
      })
      .catch(() => set({ isError: true }))
      .finally(() => set({ isLoading: false }));

    if (!response?.data.tokens.accessToken) {
      return false;
    }

    localStorage.setItem(USER_TOKEN_KEY, JSON.stringify(response?.data.user));
    localStorage.setItem(ACCESS_TOKEN_KEY, response?.data.tokens.accessToken || '');

    set({ isAuthorized: true });
    set({ userData: response.data.user });

    return true;
  },
  logout: async () => {
    const PREFIX = import.meta.env.PREFIX ?? 'apiv1';
    await api
      .post<{
        message: string;
      }>(`/${PREFIX}/auth/logout`, {})
      .then(() => {
        localStorage.clear();
        window.location.href = '/login';
      })
      .catch(() => {
        localStorage.clear();
        window.location.href = '/login';
      });
  },
  register: async ({ email, password }: { email: string; password: string }) => {
    const PREFIX = import.meta.env.PREFIX ?? 'apiv1';
    set({ isLoading: true });
    const token = await api
      .post(`/${PREFIX}/auth/signUp`, {
        email,
        password,
      })
      .catch(() => set({ isError: true }))
      .finally(() => set({ isLoading: false }));

    if (!token?.data?.tokens.accessToken) {
      return false;
    }

    localStorage.setItem(USER_TOKEN_KEY, JSON.stringify(token?.data?.user));
    localStorage.setItem(ACCESS_TOKEN_KEY, token?.data?.tokens.accessToken || '');

    set({ isAuthorized: true });
    set({ userData: token?.data.user });

    return true;
  },
}));
