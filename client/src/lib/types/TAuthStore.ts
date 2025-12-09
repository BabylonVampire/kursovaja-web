import { TUser } from './TUser';

export type TAuthStore = {
  isAuthorized: boolean;
  isLoading: boolean;
  isError: boolean;
  userData: TUser | null;
  getTokens: () => Promise<void>;
  login: ({ email, password }: { email: string; password: string }) => Promise<boolean>;
  register: ({ email, password }: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  setIsAuthorized: (value: boolean) => void;
};
