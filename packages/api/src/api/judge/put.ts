import { Request, Response } from 'express';
import { Schema } from '@hangar/shared';
import { DriverException } from '@mikro-orm/core';
import {
  CriteriaJudgingSession,
  ExpoJudgingSession,
  ExpoJudgingSessionContext,
} from '@hangar/database';
import { logger } from '../../utils/logger';
import { validatePayload } from '../../utils/validatePayload';

export const put = async (req: Request, res: Response) => {
  const { entityManager, judge } = req;
  const { inviteCode } = req.query;
  const { errorHandled, data } = validatePayload({
    req,
    res,
    schema: Schema.judge.put,
    data: { inviteCode },
  });

  if (errorHandled) return;

  try {
    const expoJudgingSession = await req.entityManager.findOne(ExpoJudgingSession, {
      inviteCode: data.inviteCode,
    });

    const criteriaJudgingSession = expoJudgingSession
      ? null
      : await req.entityManager.findOne(CriteriaJudgingSession, {
          inviteCode: data.inviteCode,
        });

    if (!expoJudgingSession && !criteriaJudgingSession) {
      res.sendStatus(403);
      return;
    }

    if (expoJudgingSession) {
      judge.expoJudgingSessionContexts.add(
        new ExpoJudgingSessionContext({
          judge: judge.toReference(),
          expoJudgingSession: expoJudgingSession.toReference(),
        }),
      );
    } else {
      judge.criteriaJudgingSessions.add(criteriaJudgingSession as CriteriaJudgingSession);
    }

    await entityManager.persistAndFlush(judge);

    res.send(judge);
  } catch (error) {
    if ((error as DriverException).code === '23505') {
      res.sendStatus(409);
      return;
    }

    res.sendStatus(500);
    logger.error('Failed to update a judge', error);
  }
};
