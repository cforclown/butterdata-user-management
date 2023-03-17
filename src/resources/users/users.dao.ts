import { model, Model } from 'mongoose';
import { HttpCodes, RestApiException } from '../../utils/exceptions';
import { ILoginPayload } from '../auth';
import { ICreateUserPayload, IUpdateUserPayload, IUser } from './users.types';

export class UsersDao {
  private readonly usersModel: Model<IUser>;

  constructor () {
    this.usersModel = model<IUser>('users');
  }

  async authenticate ({ email, password }: ILoginPayload): Promise<IUser | null> {
    return this.usersModel.findOne({ email, password, archived: false }).select('-password').exec();
  }

  async get (userId: string): Promise<IUser | null> {
    return this.usersModel.findOne({ _id: userId, archived: false }).select('-password').exec();
  }

  async getByEmail (email: string): Promise<IUser | null> {
    return this.usersModel.findOne({ email, archived: false }).select('-password').exec();
  }

  async getAll (): Promise<IUser[]> {
    return this.usersModel.find({ archived: false }).exec();
  }

  async create (payload: ICreateUserPayload): Promise<IUser> {
    return this.usersModel.create({ ...payload });
  }

  async update (payload: IUpdateUserPayload): Promise<IUser> {
    const user = await this.usersModel.findById(payload._id).exec();
    if (!user) {
      throw new RestApiException('User not found', HttpCodes.NotFound);
    }
    user.email = payload.email ?? user.email;
    user.fullname = payload.fullname ?? user.fullname;
    user.password = payload.password ?? user.password;
    await user.save();

    return user;
  }

  async delete (userId: string): Promise<string> {
    const deletedUser = await this.usersModel.findOneAndUpdate({ _id: userId }, { archived: true }).exec();
    if (!deletedUser) {
      throw new RestApiException('User not found', HttpCodes.NotFound);
    }
    return deletedUser._id;
  }
}
