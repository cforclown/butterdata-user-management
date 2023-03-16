export interface IUser {
  _id: string;
  username: string;
  email: string;
  password?: string;
  fullname: string;
}

export interface ICreateUserPayload extends Omit<IUser, '_id'> {
  password: string;
};

export interface IUpdateUserPayload {
  _id: string;
  username?: string;
  email?: string;
  password?: string;
  fullname?: string;
}
