import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/lib/components/ui/sidebar';
import { NAVIGATION } from '@/lib/constants';
import { DarkModeSelect } from '../DarkModeSelect/DarkModeSelect';
import { Button } from '@/lib/components/ui/button';
import { useAuthStore } from '@/lib/store';
import styles from './LayoutSidebar.module.scss';
import { LanguageSelect } from '../LanguageSelect/LanguageSelect';
import { useLanguageStore } from '@/lib/store/useLanguageStore';
import { messages } from '@/i18n';
import { EUserRole, ROLES_LABELS } from './LayoutSidebar.constants';

export const LayoutSidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const userData = useAuthStore((state) => state.userData);
  const appVersion = import.meta.env.VITE_APP_VERSION ?? '0.0.0';

  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const textLines = messages[currentLanguage];

  const roleLabel = ROLES_LABELS[userData?.role as EUserRole];

  return (
    <Sidebar className={styles.sideBar}>
      <SidebarHeader className={styles.sideBarHeader}>
        <div className={styles.appTitle}>{textLines.GLOBAL_APPLICATION_NAME}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>
            {[userData?.surname, userData?.name].filter(Boolean).join(' ') || 'Пользователь'}
          </div>
          <div className={styles.userMeta}>
            Роль: {roleLabel || '-'}
            </div>
		  <div className={styles.userMeta}>
            {userData?.group ? `Группа: ${userData.group}` : ''}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAVIGATION(currentLanguage, userData?.role).map((navigationItem) => (
                <SidebarMenuItem key={navigationItem.title}>
                  <SidebarMenuButton asChild>
                    <a href={navigationItem.url}>
                      <navigationItem.icon />
                      <span>{navigationItem.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LanguageSelect />
        <DarkModeSelect />
        <Button onClick={logout}>{textLines.AUTHORIZATION_LOGOUT}</Button>
        <div className={styles.appVersion}>Версия: {appVersion}</div>
      </SidebarFooter>
    </Sidebar>
  );
};
