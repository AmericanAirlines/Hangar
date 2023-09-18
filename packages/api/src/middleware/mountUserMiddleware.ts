import { NextFunction, Request, Response } from 'express';
import { User } from '@hangar/database';
import { sessionMiddleware } from './sessionMiddleware';

const mountUser = async (req: Request, res: Response, next: NextFunction) => {
  const userQuery = { id: req.session?.id };

  let user;
  try {
    user = await req.entityManager.findOne(User, userQuery);
  } catch {
    res.sendStatus(500);
    return;
  }

  if (user) {
    req.user = user;
  } else {
    // User does not exist in the database
    res.sendStatus(403);
    return;
  }

  next();
};

/**
 * Middleware that evaluates the session's validity and mounts a user onto the request.
 *
 * Paths:
 *   - Next function invoked: user was identified and matching object mounted to request
 *   - 401: Invalid session caused by missing email
 *   - 403: Unknown user with a valid session
 *   - 500: An error occurred trying to identify the user
 */
export const mountUserMiddleware = async (req: Request, res: Response, next: NextFunction) =>
  sessionMiddleware(req, res, () => mountUser(req, res, next));
