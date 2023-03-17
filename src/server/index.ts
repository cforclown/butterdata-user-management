import App from '../app';
import Database from '../database';
import { Environment, Logger } from '../utils/common';

export default class Server {
  async start (): Promise<void> {
    try {
      Logger.success('============================================================================');
      Logger.success(`| ${Environment.getNodeEnv().toUpperCase()} MODE`);
      await (new Database()).connect();
      Logger.success('| SUCCESSFULLY CONNECTED TO THE DATABASE');

      const port = Environment.getServerPort();
      const app = App();
      await app.listen(port);

      Logger.success(`| SERVER STARTED SUCCESSFULLY [${port}]`);
      Logger.success('============================================================================');
    } catch (err) {
      if (err instanceof Error) {
        Logger.error(err.message);
      }
    }
  }
}
