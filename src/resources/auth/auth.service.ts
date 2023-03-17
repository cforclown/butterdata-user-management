import { sign, verify } from 'jsonwebtoken';
import { IAccessToken, ILoginPayload, IRegisterUserPayload } from '.';
import { IUser, UsersService } from '..';
import { Environment } from '../../utils/common';
import { HttpCodes, RestApiException } from '../../utils/exceptions';
import { ILoginGooglePayload } from './auth.types';

export class AuthService {
  usersService: UsersService;

  constructor ({ usersService }: { usersService: UsersService }) {
    this.usersService = usersService;
  }

  async getUserById (userId: string): Promise<IUser> {
    const user = await this.usersService.get(userId);
    if (!user) {
      throw new RestApiException('User not found');
    }
    return user;
  }

  async authenticate (payload: ILoginPayload): Promise<IUser> {
    const user = await this.usersService.authenticate(payload);
    if (!user) {
      throw new RestApiException('User not found');
    }
    return user;
  }

  async authenticateAccessToken (accessToken: string): Promise<boolean> {
    const userTokenData = this.verifyAccessToken(accessToken);
    const user = await this.usersService.get((userTokenData as IUser)._id);
    if (!user) {
      throw new RestApiException('Access token is not valid');
    }
    return true;
  }

  async login (payload: ILoginPayload): Promise<IAccessToken> {
    const user = await this.usersService.authenticate(payload);
    if (!user) {
      throw new RestApiException('Incorrect email or password', HttpCodes.NotFound);
    }
    return this.generateAccessToken(user);
  }

  async register (payload: IRegisterUserPayload): Promise<IAccessToken> {
    if (payload.password !== payload.confirmPassword) {
      throw new RestApiException('Confirm password is not match');
    }
    const user = await this.usersService.create({ ...payload });
    return this.generateAccessToken(user);
  }

  async loginGoogle (payload: ILoginGooglePayload): Promise<IAccessToken> {
    let user = await this.usersService.getByEmail(payload.email);
    if (!user) {
      user = await this.usersService.create(payload);
    }
    return this.generateAccessToken(user);
  }

  async refresh (refreshToken: string): Promise<IAccessToken> {
    const tokenData = this.verifyAccessToken(refreshToken);
    const user = await this.usersService.get((tokenData as IUser)._id);
    if (!user) {
      throw new RestApiException('Refresh token is not valid');
    }
    return this.generateAccessToken(user);
  }

  verifyAccessToken (token: string): any {
    return verify(token, Environment.getRefreshTokenSecret());
  }

  generateAccessToken (user: IUser): IAccessToken {
    const expiresIn = Environment.getAccessTokenExpIn();
    const accessToken = sign({ ...user }, Environment.getAccessTokenSecret(), { expiresIn });
    const refreshToken = sign({ ...user }, Environment.getRefreshTokenSecret(), {
      expiresIn: Environment.getAccessRefreshTokenExpIn()
    });

    return {
      user,
      accessToken,
      refreshToken,
      expiresIn
    };
  }
}
