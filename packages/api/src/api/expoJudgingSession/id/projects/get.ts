import { Request, Response } from 'express';
import { ExpoJudgingSession } from '@hangar/database';
import { logger } from '../../../../utils/logger';

export const get = async (req: Request, res: Response) => {
  const {
    judge,
    entityManager: em,
    params: { id: ejsId },
  } = req;

  try {
    const ejs = await em.findOne(ExpoJudgingSession, { id: ejsId as string });

    if (!ejs) {
      res.sendStatus(404);
    }

    await em.populate(judge, ['expoJudgingSessionContexts']);

    const validEjsContext = judge.expoJudgingSessionContexts
      .getItems()
      .find((ejsc) => ejsc.expoJudgingSession.id === ejsId);

    if (validEjsContext) {
      const { currentProject, previousProject } = validEjsContext;

      res.send({ currentProject, previousProject });
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    logger.error('Failed to query Expo Judging Session', error);
    res.sendStatus(500);
  }
};
