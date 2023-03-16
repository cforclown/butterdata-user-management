import request from 'supertest';
import { setup } from '../../di-config';
import App from '../../app';
import { mockUpdateUserPayload, mockUser } from '../../test/mockData';
import { HttpCodes, RestApiException } from '../../utils/exceptions';

const mockJWTVerify = jest.fn();
jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
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
jest.mock('./users.dao', () => ({
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

describe('users-router', () => {
  mockUsersDaoAuthenticate.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoGet.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoGetByUsername.mockReturnValue(Promise.resolve(null));
  mockUsersDaoGetByEmail.mockReturnValue(Promise.resolve(null));
  mockUsersDaoGetAll.mockReturnValue(Promise.resolve([mockUser]));
  mockUsersDaoGetCreate.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoGetUpdate.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoGetDelete.mockImplementation((payload) => Promise.resolve(payload));

  let app: any;

  mockJWTVerify.mockReturnValue(mockUser);

  beforeAll(() => {
    setup();
    app = App();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should successfully return user', async () => {
      const response = await request(app)
        .get(`/api/users/${mockUser._id}`)
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.Ok);

      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(mockUser);
    });

    it('should return 404 when user not found', async () => {
      mockUsersDaoGet.mockReturnValueOnce(Promise.resolve(null));
      await request(app)
        .get(`/api/users/${mockUser._id}`)
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.NotFound);
    });
  });

  describe('getAll', () => {
    it('should successfully get all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual([mockUser]);
    });

    it('should return empty', async () => {
      mockUsersDaoGetAll.mockReturnValueOnce(Promise.resolve([]));

      const response = await request(app)
        .get('/api/users')
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual([]);
    });

    it('should return internal server error', async () => {
      mockUsersDaoGetAll.mockRejectedValueOnce(new Error('error'));

      await request(app)
        .get('/api/users')
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.Internal);
    });
  });

  describe('update', () => {
    it('should successfully update user', async () => {
      const response = await request(app)
        .patch('/api/users')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockUpdateUserPayload)
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(mockUser);
    });

    it('should successfully update user when only some of the field is provided', async () => {
      const response = await request(app)
        .patch('/api/users')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({
          _id: 'user-id',
          username: 'new-username'
        })
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(mockUser);
    });

    it('should fail update user when user not found', async () => {
      mockUsersDaoGet.mockReturnValueOnce(Promise.resolve(null));
      await request(app)
        .patch('/api/users')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockUpdateUserPayload)
        .expect(HttpCodes.BadRequest);
    });

    it('should fail update user when given username is taken', async () => {
      mockUsersDaoGetByUsername.mockReturnValueOnce(Promise.resolve(mockUser));
      await request(app)
        .patch('/api/users')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockUpdateUserPayload)
        .expect(HttpCodes.BadRequest);
    });

    it('should fail update user when given email already registered', async () => {
      mockUsersDaoGetByEmail.mockReturnValueOnce(Promise.resolve(mockUser));
      await request(app)
        .patch('/api/users')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockUpdateUserPayload)
        .expect(HttpCodes.BadRequest);
    });
  });

  describe('delete', () => {
    it('should successfully delete a user', async () => {
      const response = await request(app)
        .delete('/api/users/' + mockUser._id)
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(mockUser._id);
    });

    it('should throw an error when data access object throw an error', async () => {
      mockUsersDaoGetDelete.mockRejectedValueOnce(new RestApiException('internal server error', 500));
      await request(app)
        .delete('/api/users/' + mockUser._id)
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.Internal);
    });
  });
});
