import { Request, Response } from 'express';
import { ExpoJudgingSession } from '@hangar/database';
import { QueryOrder } from '@mikro-orm/core';
import { logger } from '../../utils/logger';

export const get = async (req: Request, res: Response) => {
  const { entityManager } = req;
  try {
    const expoJudgingSessions = await entityManager.find(
      ExpoJudgingSession,
      {},
      { orderBy: { createdAt: QueryOrder.ASC } },
    );
    res.send(expoJudgingSessions);
  } catch (error) {
    logger.error('Unable to fetch ExpoJudgingSessions from DB: ', error);
    res.sendStatus(500);
  }
};
