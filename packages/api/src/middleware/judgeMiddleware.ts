import { NextFunction, Request, Response } from 'express';
import { Judge } from '@hangar/database';
import { logger } from '../utils/logger';

/**
 * Middleware that evaluates the judge's validity
 *
 * Paths:
 *  - Next function invoked: judge was identified and matching object mounted to request
 *  - 401: Valid Session not found
 *  - 403: Judge not found
 *  - 500: Error occurred trying to identify
 */

export const judgeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let judge;

  if (!req.session?.id) {
    res.sendStatus(401);
    return;
  }

  try {
    judge = await req.entityManager.findOne(Judge, { user: req.session.id });
  } catch {
    res.sendStatus(500);
    return;
  }

  if (!judge) {
    // Judge does not exits in database
    logger.debug(`JudgeMiddleware failed to authenticate user - ${req.originalUrl}`);
    res.status(403).send('Judge validation failed for user');
    return;
  }
  req.judge = judge;
  next();
};
