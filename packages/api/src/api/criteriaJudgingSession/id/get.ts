import { CriteriaJudgingSession } from '@hangar/database';
import { Request, Response } from 'express';
import { logger } from '../../../utils/logger';

export const get = async (req: Request, res: Response) => {
  const {
    judge,
    entityManager: em,
    params: { id: cjsId },
  } = req;

  try {
    const cjs = await em.findOne(CriteriaJudgingSession, { id: cjsId as string });
    if (!cjs) {
      res.sendStatus(404);
      return;
    }

    await em.populate(judge, ['criteriaJudgingSessions'], {
      where: { criteriaJudgingSessions: { id: cjsId } },
    });
    const hasAccess = judge.criteriaJudgingSessions
      .getItems()
      .some((session) => session.id === cjsId);

    if (!hasAccess) {
      res.sendStatus(403);
      return;
    }

    res.send(cjs);
  } catch (error) {
    logger.error('Failed to query Expo Judging Session', error);
    res.sendStatus(500);
  }
};
