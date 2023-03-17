export interface IUser {
  _id: string;
  email: string;
  password?: string;
  fullname: string;
}

export interface ICreateUserPayload extends Omit<IUser, '_id'> {}

export interface IUpdateUserPayload {
  _id: string;
  email?: string;
  password?: string;
  fullname?: string;
}
