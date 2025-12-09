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

export const LayoutSidebar = () => {
  const logout = useAuthStore((state) => state.logout);

  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const textLines = messages[currentLanguage];

  return (
    <Sidebar className={styles.sideBar}>
      <SidebarHeader>{textLines.GLOBAL_APPLICATION_NAME}</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAVIGATION(currentLanguage).map((navigationItem) => (
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
      </SidebarFooter>
    </Sidebar>
  );
};
