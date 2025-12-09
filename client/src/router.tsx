import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './lib/components';
import { lazy, Suspense } from 'react';
import { Loader } from './lib/components/Loader/Loader';
import { ERoutes } from './lib/constants';

const MainPage = lazy(() => import('./pages/MainPage/MainPage'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const TextEditor = lazy(() => import('./pages/TextEditor/TextEditor'));

export const router = createBrowserRouter([
  {
    path: ERoutes.HOME,
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <MainPage />
          </Suspense>
        ),
      },
      {
        path: ERoutes.LOGIN,
        element: (
          <Suspense fallback={<Loader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: ERoutes.EDITOR,
        element: (
          <Suspense fallback={<Loader />}>
            <TextEditor />
          </Suspense>
        ),
      },
    ],
  },
]);
