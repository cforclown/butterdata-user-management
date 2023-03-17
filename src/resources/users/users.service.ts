import { ICreateUserPayload, IUpdateUserPayload, IUser, UsersDao } from '.';
import { ILoginGooglePayload, ILoginPayload } from '../auth';
import { RestApiException } from '../../utils/exceptions';
import { hashPassword } from '../../utils';

export class UsersService {
  private readonly usersDao: UsersDao;

  constructor ({ usersDao }: { usersDao: UsersDao;}) {
    this.usersDao = usersDao;
  }

  async authenticate ({ email, password }: ILoginPayload): Promise<IUser | null> {
    return this.usersDao.authenticate({
      email,
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
    const [isEmailRegistered] = await Promise.all([
      this.usersDao.getByEmail(payload.email)
    ]);
    if (isEmailRegistered) {
      throw new RestApiException('Email already registered');
    }

    return this.usersDao.create({
      ...payload,
      password: (await hashPassword(payload.password)),
      // createdAt: new Date(),
      // updatedAt: new Date(),
    });
  }

  async googleCreate (payload: ILoginGooglePayload): Promise<IUser> {
    const [emailRegistered] = await Promise.all([
      this.usersDao.getByEmail(payload.email)
    ]);
    if (emailRegistered) return emailRegistered;

    return this.usersDao.createByGoogle(payload);
  }

  async update (payload: IUpdateUserPayload): Promise<IUser> {
    const [user, isEmailRegistered] = await Promise.all([
      this.usersDao.get(payload._id),
      payload.email ? this.usersDao.getByEmail(payload.email) : false
    ]);
    if (!user) {
      throw new RestApiException('User not found');
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
