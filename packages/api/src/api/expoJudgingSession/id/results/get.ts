import { ExpoJudgingSession, ExpoJudgingVote, insufficientVoteCountError } from '@hangar/database';
import { Request, Response } from 'express';
import { logger } from '../../../../utils/logger';

export const get = async (req: Request, res: Response) => {
  const {
    entityManager: em,
    params: { id: ejsId },
  } = req;

  try {
    const ejs = await em.findOne(ExpoJudgingSession, { id: ejsId as string });
    if (!ejs) {
      res.sendStatus(404);
      return;
    }

    const results = await ExpoJudgingVote.tabulate({ entityManager: em, expoJudgingSession: ejs });
    res.send(results);
  } catch (error) {
    if ((error as Error).cause === insufficientVoteCountError) {
      res.status(409).send((error as Error).message);
      return;
    }
    logger.error('Failed to calculate results', error);
    res.sendStatus(500);
  }
};
