import { TUser } from './TUser';

export type TToken = {
  accessToken: string;
  refreshToken: string;
};

export type TAuthResponse = {
  tokens: TToken;
  user: TUser;
};
