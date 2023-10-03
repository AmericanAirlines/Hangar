import { Request, Response } from 'express';
import { ExpoJudgingSession } from '@hangar/database';
import { logger } from '../../../../utils/logger';

export const get = async (req: Request, res: Response) => {
  // sone functionality
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

    const validSession = judge.expoJudgingSessionContexts
      .getItems()
      .filter((ejsc) => ejsc.expoJudgingSession.id === ejsId);

    if (validSession.length) {
      const currentTeam = validSession[0]?.currentProject;
      const prevTeam = validSession[0]?.previousProject;

      res.send({ currentTeam, prevTeam });
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    logger.error('Failed to query Expo Judging Session', error);
    res.sendStatus(500);
  }
};
