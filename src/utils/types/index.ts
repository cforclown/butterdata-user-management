import { LogLevel } from '../common';

export interface Response<T> {
  data: T,
  error: string | object | [] | null | undefined;
}

export interface IException {
  code: string;
  name: string;
  level: LogLevel;
}
