import { Request, Response } from 'express';
import { CriteriaJudgingSession } from '@hangar/database';
import { QueryOrder } from '@mikro-orm/core';
import { logger } from '../../utils/logger';

export const get = async (req: Request, res: Response) => {
  const { entityManager } = req;
  try {
    const criteriaJudgingSessions = await entityManager.find(
      CriteriaJudgingSession,
      {},
      { orderBy: { createdAt: QueryOrder.ASC }, populate: ['criteriaList'] },
    );
    res.send(criteriaJudgingSessions);
  } catch (error) {
    logger.error('Unable to fetch CriteriaJudgingSessions from DB: ', error);
    res.sendStatus(500);
  }
};
