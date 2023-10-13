import { ExpoJudgingSession, ExpoJudgingVote } from '@hangar/database';
import { Request, Response } from 'express';
import { logger } from '../../../../utils/logger';

export const get = async (req: Request, res: Response) => {
  const {
    entityManager: em,
    params: { id: ejsId },
    judge,
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
    const results = await ExpoJudgingVote.tabulate({ entityManager: em, expoJudgingSession: ejs });

    res.send(results);
  } catch (error) {
    logger.error('Failed to fetch all votes', error);
    res.sendStatus(500);
  }
};
