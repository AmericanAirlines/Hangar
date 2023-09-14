import { NextFunction, Request, Response } from 'express';
import { Judge } from '@hangar/database';

/**
 * Middleware that evaluates the judge's validity
 *
 * Paths:
 *  - Next function invoked: judge wa identified and matching onject mounted to request
 *  - 400: Judge not found
 *  - 500: Error occurred trying to identify
 */

export const judgeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let judge;
  try {
    judge = await req.entityManager.findOne(Judge, { user: req.session?.id });
  } catch {
    res.sendStatus(500);
    return;
  }

  if (judge) {
    req.judge = judge;
  } else {
    //Judge does not exist in database
    res.sendStatus(403);
    return;
  }

  next();
};
