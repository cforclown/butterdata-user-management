import { IUser } from '..';

export interface IAccessToken {
  user: Omit<IUser, 'password'>;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginGooglePayload {
  email: string;
  password: string;
}

export interface IRegisterUserPayload {
  email: string;
  fullname: string;
  password: string;
  confirmPassword: string;
}

export interface IRefreshTokenPayload {
  refreshToken: string;
}
