import { ELocales, messages } from '@/i18n';
import { Home, Map } from 'lucide-react';

export enum ERoutes {
  HOME = '',
  LOGIN = 'login',
  EDITOR = 'editor',
}

export const NAVIGATION = (currentLanguage: ELocales) => [
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
];
