import { NextFunction, Request, Response } from 'express';
import { Admin } from '@hangar/database';

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const adminQuery = { user: req.user?.id };

  let userAdmin;
  try {
    userAdmin = await req.entityManager.findOne(Admin, adminQuery);
  } catch {
    res.sendStatus(500);
    return;
  }

  if (userAdmin) {
    res.sendStatus(200);
  } else {
    // Admin does not exist in the database
    res.sendStatus(403);
    return;
  }

  next();
};

/**
 * Middleware that evaluates the admins's validity.
 *
 * Paths:
 *   - Next function invoked: user was identified and matching object mounted to request
 *   - 403:  Admin not present
 *   - 500: An error occured trying to identify the Admin
 */
