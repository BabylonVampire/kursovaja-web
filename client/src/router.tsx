import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './lib/components';
import { lazy, Suspense } from 'react';
import { Loader } from './lib/components/Loader/Loader';
import { ERoutes } from './lib/constants';

const MainPage = lazy(() => import('./pages/MainPage/MainPage'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const TextEditor = lazy(() => import('./pages/TextEditor/TextEditor'));
const SettingsPage = lazy(() => import('./pages/SettingsPage/SettingsPage'));
const TeacherTopicsPage = lazy(() => import('./pages/TeacherTopicsPage/TeacherTopicsPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage/AdminUsersPage'));
const AdminGroupsPage = lazy(() => import('./pages/AdminGroupsPage/AdminGroupsPage'));
const StudentWorksPage = lazy(() => import('./pages/StudentWorksPage/StudentWorksPage'));

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
      {
        path: ERoutes.SETTINGS,
        element: (
          <Suspense fallback={<Loader />}>
            <SettingsPage />
          </Suspense>
        ),
      },
      {
        path: ERoutes.TEACHER_TOPICS,
        element: (
          <Suspense fallback={<Loader />}>
            <TeacherTopicsPage />
          </Suspense>
        ),
      },
      {
        path: ERoutes.ADMIN_USERS,
        element: (
          <Suspense fallback={<Loader />}>
            <AdminUsersPage />
          </Suspense>
        ),
      },
      {
        path: ERoutes.ADMIN_GROUPS,
        element: (
          <Suspense fallback={<Loader />}>
            <AdminGroupsPage />
          </Suspense>
        ),
      },
      {
        path: ERoutes.STUDENT_WORKS,
        element: (
          <Suspense fallback={<Loader />}>
            <StudentWorksPage />
          </Suspense>
        ),
      },
    ],
  },
]);
