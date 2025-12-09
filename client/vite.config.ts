import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.PORT ?? 5173);
  const HOSTS = String(env.HOSTS ?? 'localhost');
  const PREFIX = String(env.PREFIX ?? 'apiv1');
  const PROXY_TARGET = String(env.VITE_API_URL ?? 'http://localhost:3000');

  return {
    server: {
      port: port,
      host: '0.0.0.0',
      proxy: {
        [`/${PREFIX}`]: {
          target: PROXY_TARGET,
          ws: true,
        },
      },
      allowedHosts: [HOSTS],
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
