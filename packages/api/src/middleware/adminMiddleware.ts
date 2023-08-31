import { NextFunction, Request, Response } from 'express';
import { Admin } from '@hangar/database';

/**
 * Middleware that evaluates the admins's validity.
 *
 * Paths:
 *   - Next function invoked: user was identified and matching object mounted to request
 *   - 403:  Admin not present
 *   - 500: An error occured trying to identify the Admin
 */
export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let userAdmin;
  try {
    userAdmin = await req.entityManager.findOne(Admin, { user: req.user?.id });
  } catch {
    res.sendStatus(500);
    return;
  }

  if (userAdmin) {
    req.admin = userAdmin;
  } else {
    // Admin does not exist in the database
    res.sendStatus(403);
    return;
  }

  next();
};
