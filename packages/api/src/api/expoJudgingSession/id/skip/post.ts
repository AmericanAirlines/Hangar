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
    const ejs = await em.findOneOrFail(ExpoJudgingSession, { id: ejsId as string });
    if (!ejs) {
      res.sendStatus(404);
      return;
    }

    await judge.skip({ entityManager: em, expoJudgingSession: ejs });
    res.sendStatus(204);
  } catch (error) {
    logger.error('Failed to skip project', error);
    res.sendStatus(500);
  }
};
