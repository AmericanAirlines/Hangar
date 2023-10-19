import { ExpoJudgingSession } from '@hangar/database';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export const post = async (req: Request, res: Response, next: NextFunction) => {
  const {
    judge,
    entityManager: em,
    params: { id: ejsId },
  } = req;

  try {
    const count = await em.count(ExpoJudgingSession, { id: ejsId as string });
    if (count < 0) {
      res.sendStatus(404);
      return;
    }

    await em.populate(judge, ['expoJudgingSessionContexts']);
    const hasAccess = judge.expoJudgingSessionContexts
      .getItems()
      .some((ejsc) => ejsc.expoJudgingSession.id === ejsId);

    if (!hasAccess) {
      res.sendStatus(403);
      return;
    }

    res.sendStatus(204);
  } catch (error) {
    logger.error('Failed to skip project', error);
    res.sendStatus(500);
  }
  next();
};
