import { sign, verify } from 'jsonwebtoken';
import { IAccessToken, ILoginPayload, IRegisterUserPayload } from '.';
import { IUser, UsersService } from '..';
import { Environment } from '../../utils/common';
import { HttpCodes, RestApiException } from '../../utils/exceptions';

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

  async login (payload: ILoginPayload): Promise<IAccessToken> {
    const user = await this.usersService.authenticate(payload);
    if (!user) {
      throw new RestApiException('Incorrect username or password', HttpCodes.NotFound);
    }
    return this.generateAccessToken(user);
  }

  async verify (user?: IUser): Promise<IAccessToken> {
    if (!user) {
      throw new Error('No user object in request');
    }
    return this.generateAccessToken(user);
  }

  async register (payload: IRegisterUserPayload): Promise<IAccessToken> {
    if (payload.password !== payload.confirmPassword) {
      throw new RestApiException('Confirm password is not match');
    }
    const user = await this.usersService.create(payload);
    return this.generateAccessToken(user);
  }

  async refresh (refreshToken: string): Promise<IAccessToken> {
    const tokenData = verify(refreshToken, Environment.getRefreshTokenSecret());
    const user = await this.usersService.get((tokenData as IUser)._id);
    if (!user) {
      throw new RestApiException('Refresh token is not valid');
    }
    return this.generateAccessToken(user);
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
