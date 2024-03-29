import { NextFunction, Request, Response } from 'express';

/**
 * A middleware handler to check to see if the request included a valid session.
 *
 * Session validity is determined by the presence of an id within signed cookie included with the request.
 * If the session is valid, the next function is invoked.
 *
 * @param req Express Request
 * @param res Express Response
 * @param next Express NextFunction
 */
export const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.id) {
    // User does not have a valid session
    res.sendStatus(401);
    return;
  }

  next();
};
