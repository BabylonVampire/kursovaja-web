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

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const PREFIX = import.meta.env.PREFIX ?? 'apiv1';

      try {
        // Пытаемся обновить токен
        const { data: response } = await axios.post(`/${PREFIX}/auth/refresh`, {});

        localStorage.setItem(ACCESS_TOKEN_KEY, response);

        // Обновляем заголовок Authorization и повторяем оригинальный запрос
        originalRequest.headers.Authorization = `Bearer ${response}`;

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
