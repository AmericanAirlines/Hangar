import { CriteriaJudgingSession } from '@hangar/database';
import { Request, Response } from 'express';
import { logger } from '../../../../utils/logger';

export const get = async (req: Request, res: Response) => {
  const { entityManager: em } = req;
  const { id: cjsId } = req.params;

  try {
    const cjs = await em.findOneOrFail(
      CriteriaJudgingSession,
      { id: cjsId },
      { populate: ['projects'] },
    );
    res.send(cjs.projects);
  } catch (error) {
    logger.error('Failed to retrieve projects for criteria judging session', error);
    res.sendStatus(500);
  }
};
