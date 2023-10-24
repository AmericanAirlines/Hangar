import { CriteriaJudgingSession } from '@hangar/database';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const criteriaJudgingSessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { entityManager: em, judge } = req;
    const { id: cjsId } = req.params;

    if (cjsId === undefined) {
      res.sendStatus(404);
      return;
    }

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

    next();
  } catch (error) {
    logger.error('Criteria Judging Session middleware failed', error);
    res.sendStatus(500);
  }
};
