import { ELocales } from '@/i18n';
import { SidebarProvider } from '@/lib/components/ui/sidebar';
import { Toaster } from '@/lib/components/ui/sonner';
import { DEFAULT_LANGUAGE, PREFERRED_LANGUAGE_KEY } from '@/lib/constants/Language.constants';
import { useAuthStore } from '@/lib/store';
import { useLanguageStore } from '@/lib/store/useLanguageStore';
import { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthWrap } from '../AuthWrap/AuthWrap';
import { LayoutSidebar } from './components/LayoutSidebar/LayoutSidebar';
import { ThemeProvider } from './components/ThemeProvider/ThemeProvider';

export const Layout = () => {
  const isAuthorized = useAuthStore((state) => state.isAuthorized);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const location = useLocation();

  const isOnLoginPage = useMemo(() => location.pathname === '/login', [location]);

  useEffect(() => {
    const defaultLanguage = localStorage.getItem(PREFERRED_LANGUAGE_KEY) || DEFAULT_LANGUAGE;
    setLanguage(defaultLanguage as ELocales);
  }, []);

  return (
    <AuthWrap>
      <ThemeProvider>
        <SidebarProvider>
          {isAuthorized && !isOnLoginPage && <LayoutSidebar />}
          <Outlet />
          <Toaster />
        </SidebarProvider>
      </ThemeProvider>
    </AuthWrap>
  );
};
