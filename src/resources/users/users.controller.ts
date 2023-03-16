import { Request } from 'express';
import { UsersService } from './users.service';
import { IUser } from './users.types';
import { HttpCodes, RestApiException } from '../../utils/exceptions';

export class UsersController {
  private readonly usersService: UsersService;

  constructor ({ usersService }: { usersService: UsersService; }) {
    this.usersService = usersService;

    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async get ({ params }: Request): Promise<IUser> {
    const user = await this.usersService.get(params.objectId);
    if (!user) {
      throw new RestApiException('User not found', HttpCodes.NotFound);
    }
    return user;
  }

  async getAll (): Promise<IUser[]> {
    return this.usersService.getAll();
  }

  async update ({ body }: Request): Promise<IUser> {
    return this.usersService.update(body);
  }

  async delete ({ params }: Request): Promise<string> {
    return this.usersService.delete(params.objectId);
  }
}
