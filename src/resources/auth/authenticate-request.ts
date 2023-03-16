import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError, verify } from 'jsonwebtoken';
import { Environment, Logger } from '../../utils/common';
import { HttpCodes } from '../../utils/exceptions';
import { dro } from '../../utils';

export function authenticateRequest (excludePaths: string[]) {
  return (req: Request, res: Response, next: NextFunction): any => {
    try {
      for (const excludePath of excludePaths) {
        if (req.originalUrl.includes(excludePath) && req.method === 'GET') {
          return next();
        }
      }
      if (!req.headers.authorization) {
        return res.sendStatus(HttpCodes.Unauthorized);
      }

      const [, token] = req.headers.authorization.split(' ');
      const user = verify(token, Environment.getAccessTokenSecret());
      if (!user) {
        return res.status(HttpCodes.Unauthorized).send(dro.error('Invalid access token'));
      }

      req.user = user;

      next();
    } catch (err) {
      if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError || err instanceof NotBeforeError) {
        Logger.error(err.message);
        return res.status(HttpCodes.Unauthorized).send(dro.error(err.message));
      }
      if (err instanceof Error) {
        Logger.error(err.message);
        return res.status(HttpCodes.Internal).send(dro.error(err.message));
      }
    }
  };
}
