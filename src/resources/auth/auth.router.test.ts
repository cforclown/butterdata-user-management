import request from 'supertest';
import { setup } from '../../di-config';
import App from '../../app';
import { mockRegisterUserPayload, mockUser } from '../../test/mockData';
import { HttpCodes } from '../../utils/exceptions';
import { IAccessToken } from './auth.types';

const mockJWTSign = jest.fn();
const mockJWTVerify = jest.fn();
jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  sign: jest.fn().mockImplementation((user: any, secret: string, options: any) => mockJWTSign(user, secret, options)),
  verify: jest.fn().mockImplementation((token: string, secret: string) => mockJWTVerify(token, secret))
}));

const mockModel = jest.fn();
jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  model: jest.fn().mockImplementation((collection: string): string => mockModel(collection))
}));

const mockUsersDaoAuthenticate = jest.fn();
const mockUsersDaoGet = jest.fn();
const mockUsersDaoGetByUsername = jest.fn();
const mockUsersDaoGetByEmail = jest.fn();
const mockUsersDaoGetAll = jest.fn();
const mockUsersDaoGetCreate = jest.fn();
const mockUsersDaoGetUpdate = jest.fn();
const mockUsersDaoGetDelete = jest.fn();
jest.mock('../users/users.dao', () => ({
  UsersDao: jest.fn().mockImplementation(() => ({
    authenticate: (payload: any): void => mockUsersDaoAuthenticate(payload),
    get: (payload: any): void => mockUsersDaoGet(payload),
    getByUsername: (payload: any): void => mockUsersDaoGetByUsername(payload),
    getByEmail: (payload: any): void => mockUsersDaoGetByEmail(payload),
    getAll: (payload: any): void => mockUsersDaoGetAll(payload),
    create: (payload: any): void => mockUsersDaoGetCreate(payload),
    update: (payload: any): void => mockUsersDaoGetUpdate(payload),
    delete: (payload: any): void => mockUsersDaoGetDelete(payload)
  }))
}));

describe('auth-router', () => {
  mockUsersDaoAuthenticate.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoGet.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoGetByUsername.mockReturnValue(Promise.resolve(null));
  mockUsersDaoGetByEmail.mockReturnValue(Promise.resolve(null));
  mockUsersDaoGetAll.mockReturnValue(Promise.resolve([mockUser]));
  mockUsersDaoGetCreate.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoGetUpdate.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoGetDelete.mockImplementation((payload) => Promise.resolve(payload));

  let app: any;

  const mockAccessToken = 'generated-access-token';
  const mockRefreshToken = 'generated-refresh-token';
  const mockUserToken: IAccessToken = {
    user: mockUser,
    accessToken: mockAccessToken,
    refreshToken: mockRefreshToken,
    expiresIn: 3600
  };
  mockJWTSign.mockReturnValue(mockUser);
  mockJWTVerify.mockReturnValue(mockUser);

  beforeAll(() => {
    setup();
    app = App();
  });

  beforeEach(() => {
    mockJWTSign.mockReturnValueOnce(mockAccessToken);
    mockJWTSign.mockReturnValueOnce(mockRefreshToken);
    mockJWTVerify.mockReturnValue(mockUserToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully create a token for user', async () => {
      const response = await request(app)
        .post('/auth/login/test')
        .send({
          username: 'username',
          password: 'password'
        })
        .expect(HttpCodes.Ok);

      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(mockUserToken);
    });

    it('should fail because password not provided', async () => {
      await request(app)
        .post('/auth/login/test')
        .send({
          username: 'username'
        })
        .expect(HttpCodes.BadRequest);
    });

    it('should return 404 when user not found', async () => {
      mockUsersDaoAuthenticate.mockReturnValueOnce(Promise.resolve(null));
      await request(app)
        .post('/auth/login/test')
        .send({
          username: 'username',
          password: 'password'
        })
        .expect(HttpCodes.NotFound);
    });
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(mockRegisterUserPayload)
        .expect(HttpCodes.Ok);

      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(mockUserToken);
    });

    it('should return error when password and confirmPassword is not match', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          ...mockRegisterUserPayload,
          password: 'password',
          confirmPassword: 'not-match-password'
        })
        .expect(HttpCodes.BadRequest);
    });
  });

  describe('refresh', () => {
    it('should successfully refresh user token', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({ refreshToken: 'mock-refresh-token' })
        .expect(HttpCodes.Ok);

      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(mockUserToken);
    });

    it('should return BadRequest when refresh token is not valid anymore', async () => {
      mockUsersDaoGet.mockReturnValueOnce(Promise.resolve(null));

      await request(app)
        .post('/auth/refresh')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({ refreshToken: 'mock-refresh-token' })
        .expect(HttpCodes.BadRequest);
    });
  });

  describe('logout', () => {
    it('should successfully delete a user', async () => {
      const response = await request(app)
        .delete('/auth/logout')
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(true);
    });
  });
});
