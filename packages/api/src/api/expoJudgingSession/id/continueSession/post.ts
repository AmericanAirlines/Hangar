import { ExpoJudgingSession } from '@hangar/database';
import { Request, Response } from 'express';
import { logger } from '../../../../utils/logger';

export const post = async (req: Request, res: Response) => {
  const {
    judge,
    entityManager: em,
    params: { id: ejsId },
  } = req;

  try {
    const ejs = await em.findOne(ExpoJudgingSession, { id: ejsId as string });
    if (!ejs) {
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

    await judge.continue({ entityManager: em, expoJudgingSession: ejs });
    res.sendStatus(204);
  } catch (error) {
    // TODO: Error handling for various continue client errors

    logger.error('Failed to continue Project', error);
    res.sendStatus(500);
  }
};