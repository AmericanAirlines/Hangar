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
    // 1) search for currentTeam and nextTeam in expoJudgingSessionContexts
    const allTeams = judge.expoJudgingSessionContexts.getItems();
  } catch {
    // error
  }
};
