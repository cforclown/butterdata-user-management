import { IRole } from '../resources';

export const mockRole: IRole = {
  _id: 'role-id',
  name: 'role-name',
  permissions: {
    masterData: {
      view: true,
      create: true,
      update: true,
      delete: true
    }
  }
};
