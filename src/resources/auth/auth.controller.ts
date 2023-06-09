import express from 'express';
import { AuthService, IAccessToken } from '.';

export class AuthController {
  private readonly authService: AuthService;

  constructor ({ authService }:{ authService: AuthService }) {
    this.authService = authService;

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.refresh = this.refresh.bind(this);
    this.loginGoogle = this.loginGoogle.bind(this);
    this.authenticate = this.authenticate.bind(this);
  }

  async login ({ body }: express.Request): Promise<IAccessToken> {
    return this.authService.login(body);
  }

  async register ({ body }: express.Request): Promise<IAccessToken> {
    return this.authService.register(body);
  }

  async loginGoogle ({ body }: express.Request): Promise<IAccessToken> {
    return this.authService.loginGoogle(body);
  }

  async refresh ({ body }: express.Request): Promise<IAccessToken> {
    return this.authService.refresh(body.refreshToken);
  }

  async authenticate ({ body }: express.Request): Promise<boolean> {
    return this.authService.authenticateAccessToken(body.accessToken);
  }
}
