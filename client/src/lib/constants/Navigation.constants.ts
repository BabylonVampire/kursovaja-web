import { ELocales, messages } from '@/i18n';
import { Home, Map, Settings, BookOpenText, Users, FolderTree, Files } from 'lucide-react';
import { TUserRole } from '../types/TUser';

export enum ERoutes {
  HOME = '',
  LOGIN = 'login',
  EDITOR = 'editor',
  SETTINGS = 'settings',
  TEACHER_TOPICS = 'teacher/topics',
  ADMIN_USERS = 'admin/users',
  ADMIN_GROUPS = 'admin/groups',
  STUDENT_WORKS = 'student/works',
}

export const NAVIGATION = (currentLanguage: ELocales, role?: TUserRole) => {
  const items = [
    {
      title: messages[currentLanguage].PAGE_MAIN,
      url: `/${ERoutes.HOME}`,
      icon: Home,
    },
    {
      title: 'Редактор',
      url: `/${ERoutes.EDITOR}`,
      icon: Map,
    },
    {
      title: 'Настройки',
      url: `/${ERoutes.SETTINGS}`,
      icon: Settings,
    },
  ];

  if (role === 'teacher') {
    items.push({
      title: 'Темы преподавателя',
      url: `/${ERoutes.TEACHER_TOPICS}`,
      icon: BookOpenText,
    });
  }

  if (role === 'student') {
    items.push({
      title: 'Мои работы',
      url: `/${ERoutes.STUDENT_WORKS}`,
      icon: Files,
    });
  }

  if (role === 'admin') {
    items.push(
      {
        title: 'Пользователи',
        url: `/${ERoutes.ADMIN_USERS}`,
        icon: Users,
      },
      {
        title: 'Группы',
        url: `/${ERoutes.ADMIN_GROUPS}`,
        icon: FolderTree,
      },
    );
  }

  return items;
};
