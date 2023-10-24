import { ExpoJudgingSession, ExpoJudgingSessionContext } from '@hangar/database';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export const expoJudgeAccessMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    judge,
    entityManager: em,
    params: { id: ejsId },
  } = req;

  try {
    const ejsCount = await em.count(ExpoJudgingSession, { id: ejsId as string });
    if (ejsCount === 0) {
      res.sendStatus(404);
      return;
    }

    const contextCount = await em.count(ExpoJudgingSessionContext, {
      expoJudgingSession: {
        id: ejsId,
      },
      judge: {
        id: judge.id,
      },
    });

    if (!contextCount) {
      res.sendStatus(403);
      return;
    }
    next();
  } catch (error) {
    logger.error('Failed to evaluate expo judge access', error);
    res.sendStatus(500);
  }
};
