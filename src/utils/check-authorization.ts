import { NextFunction, Request, Response } from 'express';
import { dro } from './dro';
import { HttpCodes } from './exceptions';
import { saveErrorLog } from './common';
// import { IUser } from '../resources';

export function checkAuthorization (resourceType: string, action: string, forbiddenMsg = `You don't have the authority to '${action}' on resource '${resourceType}'`) {
  return (req: Request, res: Response, next: NextFunction): any => {
    try {
      if (!req.user) {
        return res.status(HttpCodes.Unauthorized).send(dro.error('UNAUTHORIZED'));
      }
      // if (!((req.user as IUser).role as IRole).permissions[resourceType][action]) {
      //   return res.status(HttpCodes.Forbidden).send(dro.error(forbiddenMsg));
      // }

      return next();
    } catch (err) {
      if (err instanceof Error) {
        saveErrorLog(err);
      }
      return res.status(HttpCodes.Forbidden).send(dro.error(forbiddenMsg));
    }
  };
}
