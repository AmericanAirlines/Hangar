import { Request, Response } from 'express';
import { User } from '@hangar/database';
import { sessionMiddleware } from './sessionMiddleware';

export const mountUserMiddleware = async (req: Request, res: Response, next: Function) => {
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

export const validateSessionMountUser = [sessionMiddleware, mountUserMiddleware] as const;