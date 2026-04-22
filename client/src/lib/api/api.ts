import axios from 'axios';
import { ACCESS_TOKEN_KEY } from '../constants';

export const api = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_VITE_API_URL,
});

api.interceptors.request.use((config) => {
  config.headers!.Authorization = `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const PREFIX = import.meta.env.PREFIX ?? 'apiv1';

    if (error?.response?.status === 401 && !originalRequest?._retry) {
      if (originalRequest?.url?.includes(`/${PREFIX}/auth/refresh`)) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        const { data } = await api.post(`/${PREFIX}/auth/refresh`, {});

        localStorage.setItem(ACCESS_TOKEN_KEY, data?.tokens?.accessToken || '');

        originalRequest.headers.Authorization = `Bearer ${data?.tokens?.accessToken || ''}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
