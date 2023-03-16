import { UsersDao } from '.';
import { mockCreateUserPayload, mockUpdateUserPayload, mockUser } from '../../test/mockData';
import { RestApiException } from '../../utils/exceptions';
import { UsersService } from './users.service';

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

jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  model: jest.fn().mockImplementation(() => ({}))
}));

describe('users-service', () => {
  mockUsersDaoAuthenticate.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoGet.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoGetByUsername.mockReturnValue(Promise.resolve(null));
  mockUsersDaoGetByEmail.mockReturnValue(Promise.resolve(null));
  mockUsersDaoGetAll.mockReturnValue(Promise.resolve([mockUser]));
  mockUsersDaoGetCreate.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoGetUpdate.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoGetDelete.mockImplementation((payload) => Promise.resolve(payload));

  const usersService = new UsersService({
    usersDao: new UsersDao()
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should successfully return user', async () => {
      const user = await usersService.authenticate({ username: 'username', password: 'password' });
      expect(mockUsersDaoAuthenticate).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });

    it('should throw an error when user not found', async () => {
      mockUsersDaoAuthenticate.mockReturnValueOnce(null);

      const user = await usersService.authenticate({ username: 'username', password: 'password' });
      expect(user).toEqual(null);
    });
  });

  describe('get getAll', () => {
    it('should successfully return user', async () => {
      expect(await usersService.get(mockUser._id)).toEqual(mockUser);
      expect(await usersService.getAll()).toEqual([mockUser]);
    });

    it('should return null when user not found', async () => {
      mockUsersDaoGet.mockReturnValueOnce(null);

      expect(await usersService.get(mockUser._id)).toEqual(null);
    });
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      expect(await usersService.create(mockCreateUserPayload)).toEqual(mockUser);
    });

    it('should throw an error when username is taken', async () => {
      mockUsersDaoGetByUsername.mockReturnValueOnce(mockUser);

      await expect(usersService.create(mockCreateUserPayload)).rejects.toThrow(RestApiException);
    });

    it('should throw RestApiException when email already registered', async () => {
      mockUsersDaoGetByEmail.mockReturnValueOnce(Promise.resolve(mockUser));

      await expect(usersService.create(mockCreateUserPayload)).rejects.toThrow(RestApiException);
    });
  });

  describe('update', () => {
    it('should successfully update a user', async () => {
      expect(await usersService.update(mockUpdateUserPayload)).toEqual(mockUser);
    });

    it('should throw an error when username is taken', async () => {
      mockUsersDaoGetByUsername.mockReturnValueOnce(mockUser);

      await expect(usersService.update(mockUpdateUserPayload)).rejects.toThrow(RestApiException);
    });

    it('should throw RestApiException when email already registered', async () => {
      mockUsersDaoGetByEmail.mockReturnValueOnce(Promise.resolve(mockUser));

      await expect(usersService.update(mockUpdateUserPayload)).rejects.toThrow(RestApiException);
    });
  });

  describe('delete', () => {
    it('should successfully delete a user', async () => {
      expect(await usersService.delete('user-id')).toEqual('user-id');
    });
  });
});
