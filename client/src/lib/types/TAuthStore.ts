import { TUser } from './TUser';

export type TAuthStore = {
  isAuthorized: boolean;
  isLoading: boolean;
  isError: boolean;
  userData: TUser | null;
  getTokens: () => Promise<void>;
  login: ({ email, password }: { email: string; password: string }) => Promise<boolean>;
  register: ({
    email,
    password,
    name,
    surname,
  }: {
    email: string;
    password: string;
    name?: string;
    surname?: string;
  }) => Promise<boolean>;
  logout: () => void;
  setIsAuthorized: (value: boolean) => void;
  setUserData: (userData: TUser | null) => void;
  updateProfile: (payload: {
    email?: string;
    group?: string | null;
    name?: string;
    surname?: string;
  }) => Promise<TUser | null>;
};
