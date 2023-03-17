export interface IUser {
  _id: string;
  email: string;
  password?: string;
  fullname: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUserPayload extends Omit<IUser, '_id'> {
  password: string;
};

export interface IUpdateUserPayload {
  _id: string;
  email?: string;
  password?: string;
  fullname?: string;
}
