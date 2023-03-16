import { UsersDao } from '.';
import { RestApiException } from '../../utils/exceptions';
import { mockCreateUserPayload, mockUpdateUserPayload, mockUser } from '../../test/mockData';
import { MockMongooseModel } from '../../test/mockMongooseModel';

jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  model: jest.fn().mockImplementation(() => MockMongooseModel)
}));

describe('users-dao', () => {
  MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(mockUser));
  MockMongooseModel.mockSelect.mockImplementation(() => ({
    exec: (): any => MockMongooseModel.mockExec()
  }));
  MockMongooseModel.mockFindById.mockImplementation(() => ({
    select: (payload: any): any => MockMongooseModel.mockSelect(payload)
  }));
  MockMongooseModel.mockFindOne.mockImplementation(() => ({
    select: (payload: any): any => MockMongooseModel.mockSelect(payload)
  }));
  MockMongooseModel.mockCreate.mockReturnValue(Promise.resolve(mockUser));
  MockMongooseModel.mockFindOneAndUpdate.mockImplementation(() => ({
    exec: (): any => MockMongooseModel.mockExec()
  }));
  MockMongooseModel.mockFindOneAndDelete.mockImplementation(() => ({
    exec: (): any => MockMongooseModel.mockExec()
  }));

  const usersDao = new UsersDao();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should successfully authenticate user', async () => {
      const user = await usersDao.authenticate({ username: 'username', password: 'password' });
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });

    it('should throw an error when user not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      const user = await usersDao.authenticate({ username: 'username', password: 'password' });
      expect(user).toEqual(null);
    });

    it('should throw an error when model.findOne throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new Error('error'));
      await expect(usersDao.authenticate({ username: 'username', password: 'password' })).rejects.toThrowError();
    });
  });

  describe('get', () => {
    it('should successfully get user', async () => {
      const user = await usersDao.get(mockUser._id);
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });

    it('should throw an error when user not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      const user = await usersDao.get(mockUser._id);
      expect(user).toEqual(null);
    });

    it('should throw an error when model.findById throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new Error('error'));
      await expect(usersDao.get(mockUser._id)).rejects.toThrowError();
    });
  });

  describe('getByUsername', () => {
    it('should successfully return a user', async () => {
      const user = await usersDao.getByUsername('mock-username');
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });

    it('should throw an error when user not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      const user = await usersDao.getByUsername('mock-username');
      expect(user).toEqual(null);
    });

    it('should throw an error when model.findOne throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new Error('error'));
      await expect(usersDao.getByUsername('mock-username')).rejects.toThrowError();
    });
  });

  describe('getByEmail', () => {
    it('should successfully return a user', async () => {
      const user = await usersDao.getByEmail('mock-email');
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });

    it('should throw an error when user not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      const user = await usersDao.getByEmail('mock-email');
      expect(user).toEqual(null);
    });

    it('should throw an error when model.findOne throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new Error('error'));
      await expect(usersDao.getByEmail('mock-email')).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should successfully create an user', async () => {
      const user = await usersDao.create({ ...mockCreateUserPayload });
      expect(user).toEqual(mockUser);
    });

    it('should throw an error', async () => {
      MockMongooseModel.mockCreate.mockRejectedValueOnce(new RestApiException('error'));
      await expect(usersDao.create({ ...mockCreateUserPayload })).rejects.toThrow(RestApiException);
    });
  });

  describe('update', () => {
    const mockSave = jest.fn();

    beforeEach(() => {
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve({
        ...mockUser,
        save: () => mockSave()
      }));
      MockMongooseModel.mockFindById.mockImplementation(() => ({
        exec: (): any => MockMongooseModel.mockExec()
      }));
    });

    it('should successfully update user', async () => {
      const user = await usersDao.update(mockUpdateUserPayload);
      expect(MockMongooseModel.mockFindById).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
      expect(user).toEqual(expect.objectContaining({
        ...mockUser,
        ...mockUpdateUserPayload
      }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully update only users username', async () => {
      const user = await usersDao.update({
        _id: 'id',
        username: 'username'
      });
      expect(MockMongooseModel.mockFindById).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
      expect(user).toEqual(expect.objectContaining({
        ...mockUser,
        username: 'username'
      }));
    });

    it('should throw an error when user not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      await expect(usersDao.update(mockUpdateUserPayload)).rejects.toThrow(RestApiException);
    });

    it('should throw an error when document.save() throw an error', async () => {
      mockSave.mockRejectedValueOnce(new Error());
      await expect(usersDao.update(mockUpdateUserPayload)).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    it('should successfully delete user', async () => {
      const deletedUserId = await usersDao.delete('user-id');
      expect(MockMongooseModel.mockFindOneAndUpdate).toHaveBeenCalled();
      expect(deletedUserId).toEqual('user-id');
    });

    it('should throw api error when deletedCount is 0', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      await expect(usersDao.delete('user-id')).rejects.toThrow(RestApiException);
    });

    it('should throw an error when model.deleteOne throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new Error());
      await expect(usersDao.get(mockUser._id)).rejects.toThrowError();
    });
  });
});
