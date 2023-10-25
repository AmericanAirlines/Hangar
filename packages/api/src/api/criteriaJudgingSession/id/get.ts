import { CriteriaJudgingSession } from '@hangar/database';
import { Request, Response } from 'express';
import { logger } from '../../../utils/logger';

export const get = async (req: Request, res: Response) => {
  const {
    entityManager: em,
    params: { id: cjsId },
  } = req;

  try {
    const cjs = await em.findOneOrFail(
      CriteriaJudgingSession,
      { id: cjsId as string },
      { populate: ['criteriaList'] },
    );

    res.send(cjs);
  } catch (error) {
    logger.error('Failed to query Expo Judging Session', error);
    res.sendStatus(500);
  }
};
