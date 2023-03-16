import mongoose from 'mongoose';
import { Environment } from '../utils/common';
import { UsersModel } from '../resources';

class Database {
  constructor () {
    this.connect = this.connect.bind(this);
  }

  async connect (): Promise<void> {
    await mongoose.connect(Environment.getDBUri(), { dbName: Environment.getDBName() });

    this.registerModels();
  }

  close (): void {
    mongoose.disconnect();
  }

  registerModels (): void {
    mongoose.model('users', UsersModel);
  }
}

export default Database;
