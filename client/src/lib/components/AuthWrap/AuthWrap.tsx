import { ERoutes, SESSION_ID_KEY, USER_TOKEN_KEY } from '@/lib/constants';
import { useAuthStore } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';
import { FC, PropsWithChildren, useLayoutEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const AuthWrap: FC<PropsWithChildren> = ({ children }) => {
  const setIsAuthorized = useAuthStore((state) => state.setIsAuthorized);
  const getTokens = useAuthStore((state) => state.getTokens);
  const isAuthorized = useAuthStore((state) => state.isAuthorized);
  const navigate = useNavigate();
  const location = useLocation();
  const isOnLoginPage = useMemo(() => location.pathname === `/${ERoutes.LOGIN}`, [location]);

  const toLoginPage = () => {
    setIsAuthorized(false);
    localStorage.clear();
    window.location.href = `/${ERoutes.LOGIN}`;
  };

  const validateTokens = async () => {
    try {
      const currentUser = localStorage.getItem(USER_TOKEN_KEY);

      if (isOnLoginPage) {
        return;
      }

      if (!currentUser && !isOnLoginPage) {
        toLoginPage();
        return;
      }

      await getTokens().catch((error) => {
        console.error(error);
        toLoginPage();
        return;
      });

      if (isOnLoginPage) {
        navigate('/');
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error(error);
      toLoginPage();
    }
  };

  useLayoutEffect(() => {
    if (!sessionStorage.getItem(SESSION_ID_KEY)) {
      sessionStorage.setItem(SESSION_ID_KEY, uuidv4());
    }

    validateTokens();
  }, []);
  return children;
};
