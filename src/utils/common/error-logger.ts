import { Logger } from './logger';
import { Environment } from '.';

export async function ErrorLogger (err: Record<string, any>): Promise<void> {
  if (Environment.getNodeEnv() === 'test') {
    return;
  }

  Logger.error('=========================================');
  try {
    Logger.danger(`MESSAGE: ${err.message ?? ''}`);
    if (err.stack) {
      Logger.warn('STACKTRACE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      Logger.warn(err.stack);
      Logger.warn('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    }
    Logger.success('ERROR SAVED');
  } catch (err) {
    if (err instanceof Error) {
      Logger.error(err.message);
    }
  }
  Logger.error('=========================================');
}
