import { Request, Response } from 'express';
import {
  ExpoJudgingSessionContext,
  ExpoJudgingSession,
  Judge,
  CriteriaJudgingSession,
} from '@hangar/database';
import { Schema } from '@hangar/shared';
import { DriverException, ref } from '@mikro-orm/core';
import { logger } from '../../utils/logger';
import { validatePayload } from '../../utils/validatePayload';

export const post = async (req: Request, res: Response) => {
  const { entityManager, user } = req;
  const { inviteCode } = req.query;
  const { errorHandled, data } = validatePayload({
    req,
    res,
    schema: Schema.judge.post,
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

    const judge = new Judge({ user: ref(user) });
    if (expoJudgingSession) {
      judge.expoJudgingSessionContexts.add(
        new ExpoJudgingSessionContext({
          judge: ref(judge),
          expoJudgingSession: ref(expoJudgingSession),
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
    logger.error('Failed to create a judge', error);
  }
};
