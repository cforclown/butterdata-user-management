import { ICreateUserPayload, IUpdateUserPayload, IUser, UsersDao } from '.';
import { ILoginPayload } from '../auth';
import { RestApiException } from '../../utils/exceptions';
import { hashPassword } from '../../utils';

export class UsersService {
  private readonly usersDao: UsersDao;

  constructor ({ usersDao }: { usersDao: UsersDao;}) {
    this.usersDao = usersDao;
  }

  async authenticate ({ username, password }: ILoginPayload): Promise<IUser | null> {
    return this.usersDao.authenticate({
      username,
      password: (await hashPassword(password))
    });
  }

  get (userId: string): Promise<IUser | null> {
    return this.usersDao.get(userId);
  }

  getAll (): Promise<IUser[]> {
    return this.usersDao.getAll();
  }

  async create (payload: ICreateUserPayload): Promise<IUser> {
    const [isUsernameTaken, isEmailRegistered] = await Promise.all([
      this.usersDao.getByUsername(payload.username),
      this.usersDao.getByEmail(payload.email)
    ]);
    if (isUsernameTaken) {
      throw new RestApiException('Username is taken');
    }
    if (isEmailRegistered) {
      throw new RestApiException('Email already registered');
    }

    return this.usersDao.create({
      ...payload,
      password: (await hashPassword(payload.password))
    });
  }

  async update (payload: IUpdateUserPayload): Promise<IUser> {
    const [user, isUsernameTaken, isEmailRegistered] = await Promise.all([
      this.usersDao.get(payload._id),
      payload.username ? this.usersDao.getByUsername(payload.username) : false,
      payload.email ? this.usersDao.getByEmail(payload.email) : false
    ]);
    if (!user) {
      throw new RestApiException('User not found');
    }
    if (isUsernameTaken && user.username !== payload.username) {
      throw new RestApiException('Username is taken');
    }
    if (isEmailRegistered && user.email !== payload.email) {
      throw new RestApiException('Email already registered');
    }

    return this.usersDao.update(payload);
  }

  delete (userId: string): Promise<string> {
    return this.usersDao.delete(userId);
  }
}
